import axios, { isAxiosError, type AxiosInstance } from "axios";

import { RealtimeError, type RealtimeConnect } from "@/core/realtime/types";

const MIN_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

const jitter = (ms: number) => Math.round(ms * (0.5 + Math.random() / 2));

function toTicketError(error: unknown): unknown {
  if (!isAxiosError(error) || !error.response) return error;

  const { status, headers } = error.response;
  if (status === 429) {
    const seconds = Number(headers["retry-after"]);
    return new RealtimeError(
      "rate_limited",
      "Limite de conexões ao vivo atingido. Tentaremos novamente em instantes.",
      seconds > 0 ? seconds * 1_000 : undefined,
    );
  }
  if (status === 408 || status >= 500) {
    return new RealtimeError("ticket_failed", `Falha ao obter o ticket (${status}).`);
  }
  return new RealtimeError("ticket_rejected", `Ticket recusado (${status}).`);
}

async function requestTicket(http: AxiosInstance, signal: AbortSignal): Promise<string> {
  const { data } = await http
    .post<{ ticket?: unknown } | null>("/api/realtime/ticket", null, { signal })
    .catch((error: unknown) => {
      throw toTicketError(error);
    });

  const ticket = data?.ticket;
  if (typeof ticket !== "string" || !ticket) {
    throw new RealtimeError("ticket_failed", "Resposta de ticket inválida.");
  }
  return ticket;
}

export function createRealtimeClient(http: AxiosInstance): RealtimeConnect {
  return (subscription) => {
    const controller = new AbortController();
    let source: EventSource | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let staleTimer: ReturnType<typeof setTimeout> | undefined;
    let delay = MIN_DELAY_MS;
    let closed = false;
    let retried = false;

    const disconnect = () => {
      if (closed) return;
      closed = true;
      controller.abort();
      clearTimeout(retryTimer);
      clearTimeout(staleTimer);
      source?.close();
      subscription.onStatus?.("closed");
    };

    const retry = (after = jitter(delay)) => {
      retried = true;
      subscription.onStatus?.("reconnecting");
      retryTimer = setTimeout(open, after);
      delay = Math.min(delay * 2, MAX_DELAY_MS);
    };

    const drop = () => {
      clearTimeout(staleTimer);
      source?.close();
      retry();
    };

    const armStale = () => {
      clearTimeout(staleTimer);
      if (subscription.staleAfterMs) staleTimer = setTimeout(drop, subscription.staleAfterMs);
    };

    const handle = (event: Event) => {
      armStale();
      const { data, type } = event as MessageEvent<string>;
      let parsed: ReturnType<typeof subscription.schema.parse>;
      try {
        parsed = subscription.schema.parse(JSON.parse(data));
      } catch {
        subscription.onError?.(new RealtimeError("invalid_event", `Evento "${type}" inválido.`));
        return;
      }
      subscription.onEvent(parsed, type);
    };

    async function open() {
      try {
        const ticket = await requestTicket(http, controller.signal);

        source = new EventSource(http.getUri({ url: subscription.path, params: { ticket } }));
        source.onopen = () => {
          delay = MIN_DELAY_MS;
          subscription.onStatus?.("open");
          if (retried) {
            retried = false;
            subscription.onReconnect?.();
          }
          armStale();
        };
        source.onerror = drop;
        source.onmessage = handle;
        subscription.eventNames?.forEach((name) => source?.addEventListener(name, handle));
      } catch (error) {
        if (closed) return;
        const failure =
          error instanceof RealtimeError
            ? error
            : new RealtimeError("ticket_failed", "Não foi possível obter o ticket de conexão.");
        subscription.onError?.(failure);
        if (failure.code === "ticket_rejected") {
          disconnect();
          return;
        }
        retry(failure.retryAfterMs);
      }
    }

    subscription.onStatus?.("connecting");
    void open();

    return disconnect;
  };
}

// TODO: trocar por createRealtimeClient(<instância axios de src/lib>) quando ela existir (stack.md); hoje o ticket sai sem token (anônimo) e a base vem de NEXT_PUBLIC_API_URL
export const connectRealtime = createRealtimeClient(
  axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
);
