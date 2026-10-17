import axios, {
  AxiosError,
  CanceledError,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RealtimeError, RealtimeSubscription } from "@/core/realtime/types";

import { createRealtimeClient } from "./realtime-client";

const BASE = "https://api.test";

type Score = { score: number };

type Reply =
  | { status?: number; headers?: Record<string, string>; body?: unknown }
  | Error
  | ((config: InternalAxiosRequestConfig) => Promise<AxiosResponse>);

class FakeEventSource {
  static instances: FakeEventSource[] = [];

  onopen: (() => void) | null = null;
  onerror: ((event?: Event) => void) | null = null;
  onmessage: ((event: Event) => void) | null = null;
  listeners = new Map<string, (event: Event) => void>();
  close = vi.fn();

  constructor(readonly url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(name: string, listener: (event: Event) => void) {
    this.listeners.set(name, listener);
  }

  open() {
    this.onopen?.();
  }

  fail() {
    this.onerror?.();
  }

  serverError(data: string) {
    this.onerror?.(new MessageEvent("error", { data }));
  }

  message(data: string, type = "message") {
    const event = { data, type } as unknown as Event;
    if (type === "message") this.onmessage?.(event);
    else this.listeners.get(type)?.(event);
  }
}

const replies: Reply[] = [];
const configs: InternalAxiosRequestConfig[] = [];
let offline = false;

const adapter: AxiosAdapter = async (config) => {
  configs.push(config);
  if (offline) throw new AxiosError("Network Error", AxiosError.ERR_NETWORK, config);

  const reply = replies.shift() ?? {};
  if (typeof reply === "function") return reply(config);
  if (reply instanceof Error) throw reply;

  const { status = 200, headers = {}, body = { data: { ticket: "abc" } } } = reply;
  const response: AxiosResponse = { data: body, status, statusText: "", headers, config };
  if (status < 300) return response;
  throw new AxiosError(`status ${status}`, AxiosError.ERR_BAD_RESPONSE, config, undefined, response);
};

const makeHttp = () => axios.create({ baseURL: BASE, adapter });

const schema = { parse: (data: unknown) => data as Score };

const flush = () => vi.advanceTimersByTimeAsync(0);
const sources = () => FakeEventSource.instances;

describe("createRealtimeClient", () => {
  let random: ReturnType<typeof vi.spyOn>;

  function start(overrides: Partial<RealtimeSubscription<Score>> = {}, http: AxiosInstance = makeHttp()) {
    const callbacks = {
      onEvent: vi.fn(),
      onStatus: vi.fn(),
      onError: vi.fn<(error: RealtimeError) => void>(),
      onReconnect: vi.fn(),
    };
    const connect = createRealtimeClient(http);
    const disconnect = connect({ channel: { type: "match", id: "1" }, schema, ...callbacks, ...overrides });
    return { ...callbacks, disconnect };
  }

  async function startOpen(overrides: Partial<RealtimeSubscription<Score>> = {}) {
    const started = start(overrides);
    await flush();
    sources()[0].open();
    return started;
  }

  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.instances = [];
    replies.length = 0;
    configs.length = 0;
    offline = false;
    random = vi.spyOn(Math, "random").mockReturnValue(1);
    vi.stubGlobal("EventSource", FakeEventSource);
  });

  afterEach(() => {
    random.mockRestore();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("conexão e ticket", () => {
    it("pede o ticket, conecta com ele na URL e entrega eventos validados", async () => {
      const { onEvent, onStatus } = await startOpen();

      expect(configs[0]).toMatchObject({ method: "post", url: "/api/realtime/ticket", baseURL: BASE });
      expect(JSON.parse(configs[0].data)).toEqual({ channel_type: "match", channel_id: "1" });
      expect(sources()[0].url).toBe(`${BASE}/api/match/1/live?ticket=abc`);

      sources()[0].message('{"score":3}');
      expect(onEvent).toHaveBeenCalledWith({ score: 3 }, "message");
      expect(onStatus.mock.calls.map(([status]) => status)).toEqual(["connecting", "open"]);
    });

    it("codifica o ticket na query string", async () => {
      replies.push({ body: { data: { ticket: "a b&c" } } });
      start();
      await flush();

      expect(new URL(sources()[0].url).searchParams.get("ticket")).toBe("a b&c");
    });

    it("usa a instância recebida: interceptors valem para cada tentativa de ticket", async () => {
      const http = makeHttp();
      let calls = 0;
      http.interceptors.request.use((config) => {
        config.headers.set("Authorization", `Bearer ${++calls}`);
        return config;
      });
      start({}, http);
      await flush();
      sources()[0].fail();
      await vi.advanceTimersByTimeAsync(1_000);

      expect(configs.map((config) => config.headers.get("Authorization"))).toEqual([
        "Bearer 1",
        "Bearer 2",
      ]);
    });

    it("entrega eventos nomeados com o nome do evento", async () => {
      const { onEvent } = start({ eventNames: ["score", "status"] });
      await flush();

      sources()[0].message('{"score":1}', "score");
      sources()[0].message('{"score":2}', "status");

      expect(onEvent.mock.calls).toEqual([
        [{ score: 1 }, "score"],
        [{ score: 2 }, "status"],
      ]);
    });
  });

  describe("falhas ao obter o ticket", () => {
    it("em 429 informa rate_limited e tenta de novo exatamente após o Retry-After", async () => {
      replies.push({ status: 429, headers: { "retry-after": "5" } });
      const { onError, onStatus } = start();
      await flush();

      expect(onError.mock.calls[0][0].code).toBe("rate_limited");
      expect(onError.mock.calls[0][0].retryAfterMs).toBe(5_000);
      expect(onStatus).toHaveBeenLastCalledWith("reconnecting");

      await vi.advanceTimersByTimeAsync(4_999);
      expect(sources()).toHaveLength(0);
      await vi.advanceTimersByTimeAsync(1);
      expect(sources()).toHaveLength(1);
    });

    it("em 429 sem Retry-After usa o backoff padrão", async () => {
      replies.push({ status: 429 });
      const { onError } = start();
      await flush();

      expect(onError.mock.calls[0][0].retryAfterMs).toBeUndefined();
      await vi.advanceTimersByTimeAsync(1_000);
      expect(sources()).toHaveLength(1);
    });

    it.each([500, 503, 408])("em %i informa ticket_failed e tenta de novo", async (status) => {
      replies.push({ status });
      const { onError } = start();
      await flush();

      expect(onError.mock.calls[0][0].code).toBe("ticket_failed");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(sources()).toHaveLength(1);
    });

    it.each([
      ["erro de rede", new AxiosError("Network Error", AxiosError.ERR_NETWORK)],
      ["erro inesperado", new Error("boom")],
    ])("em %s informa ticket_failed e tenta de novo", async (_, error) => {
      replies.push(error);
      const { onError } = start();
      await flush();

      expect(onError.mock.calls[0][0].code).toBe("ticket_failed");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(sources()).toHaveLength(1);
    });

    it.each([
      ["sem o campo ticket", { data: { other: 1 } }],
      ["com ticket vazio", { data: { ticket: "" } }],
      ["com ticket não textual", { data: { ticket: 42 } }],
      ["com corpo que não é JSON", "not-json"],
      ["sem corpo", null],
      ["com ticket fora de data", { ticket: "abc" }],
    ])("resposta %s informa ticket_failed", async (_, body) => {
      replies.push({ body });
      const { onError } = start();
      await flush();

      expect(onError.mock.calls[0][0].code).toBe("ticket_failed");
      expect(sources()).toHaveLength(0);
    });

    it.each([400, 401, 403, 404])(
      "em %i informa ticket_rejected, fecha e não tenta de novo",
      async (status) => {
        replies.push({ status });
        const { onError, onStatus } = start();
        await flush();

        expect(onError.mock.calls[0][0].code).toBe("ticket_rejected");
        expect(onStatus).toHaveBeenLastCalledWith("closed");

        await vi.advanceTimersByTimeAsync(120_000);
        expect(configs).toHaveLength(1);
        expect(sources()).toHaveLength(0);
      },
    );
  });

  describe("reconexão", () => {
    it("ao cair fecha a fonte, reemite o ticket e reconecta", async () => {
      const { onStatus } = await startOpen();
      sources()[0].fail();

      expect(sources()[0].close).toHaveBeenCalled();
      expect(onStatus).toHaveBeenLastCalledWith("reconnecting");

      await vi.advanceTimersByTimeAsync(1_000);
      expect(configs).toHaveLength(2);
      expect(sources()).toHaveLength(2);
    });

    it("evento error do servidor informa rate_limited e só tenta de novo após 15s", async () => {
      const { onError, onStatus } = await startOpen();
      sources()[0].serverError('{"detail":"Limite de conexões em tempo real atingido (100)."}');

      expect(onError.mock.calls[0][0].code).toBe("rate_limited");
      expect(onError.mock.calls[0][0].retryAfterMs).toBe(15_000);
      expect(sources()[0].close).toHaveBeenCalled();
      expect(onStatus).toHaveBeenLastCalledWith("reconnecting");

      await vi.advanceTimersByTimeAsync(14_999);
      expect(sources()).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(sources()).toHaveLength(2);
    });

    it("falha de conexão sem payload não é tratada como rate_limited", async () => {
      const { onError } = await startOpen();
      sources()[0].fail();

      expect(onError).not.toHaveBeenCalled();
    });

    it("onReconnect dispara só em aberturas posteriores a uma falha", async () => {
      const { onReconnect } = await startOpen();
      expect(onReconnect).not.toHaveBeenCalled();

      sources()[0].fail();
      await vi.advanceTimersByTimeAsync(1_000);
      sources()[1].open();
      expect(onReconnect).toHaveBeenCalledTimes(1);

      sources()[1].fail();
      await vi.advanceTimersByTimeAsync(1_000);
      sources()[2].open();
      expect(onReconnect).toHaveBeenCalledTimes(2);
    });

    it("onReconnect também dispara quando a primeira tentativa falhou", async () => {
      replies.push({ status: 500 });
      const { onReconnect } = start();
      await flush();
      await vi.advanceTimersByTimeAsync(1_000);
      sources()[0].open();

      expect(onReconnect).toHaveBeenCalledTimes(1);
    });

    it("dobra a espera a cada falha até o teto de 30s", async () => {
      offline = true;
      start();
      await flush();

      let calls = 1;
      for (const wait of [1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000]) {
        await vi.advanceTimersByTimeAsync(wait - 1);
        expect(configs).toHaveLength(calls);
        await vi.advanceTimersByTimeAsync(1);
        calls += 1;
        expect(configs).toHaveLength(calls);
      }
    });

    it("volta a esperar 1s depois de uma conexão bem-sucedida", async () => {
      replies.push(new Error("offline"), new Error("offline"));
      start();
      await flush();
      await vi.advanceTimersByTimeAsync(1_000);
      await vi.advanceTimersByTimeAsync(2_000);
      sources()[0].open();
      sources()[0].fail();

      await vi.advanceTimersByTimeAsync(999);
      expect(sources()).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(sources()).toHaveLength(2);
    });

    it("aplica jitter entre 50% e 100% da espera", async () => {
      random.mockReturnValue(0);
      replies.push(new Error("offline"));
      start();
      await flush();

      await vi.advanceTimersByTimeAsync(499);
      expect(sources()).toHaveLength(0);
      await vi.advanceTimersByTimeAsync(1);
      expect(sources()).toHaveLength(1);
    });
  });

  describe("encerramento", () => {
    it("disconnect fecha a fonte e informa closed uma única vez", async () => {
      const { disconnect, onStatus } = await startOpen();

      disconnect();
      disconnect();

      expect(sources()[0].close).toHaveBeenCalled();
      expect(onStatus.mock.calls.filter(([status]) => status === "closed")).toHaveLength(1);
    });

    it("disconnect durante o pedido de ticket cancela o pedido sem erro nem conexão", async () => {
      replies.push(
        (config) =>
          new Promise((_, reject) =>
            config.signal?.addEventListener?.("abort", () =>
              reject(new CanceledError(undefined, config)),
            ),
          ),
      );
      const { disconnect, onError } = start();
      await flush();

      disconnect();
      await flush();

      expect(configs[0].signal?.aborted).toBe(true);
      expect(onError).not.toHaveBeenCalled();
      expect(sources()).toHaveLength(0);

      await vi.advanceTimersByTimeAsync(120_000);
      expect(configs).toHaveLength(1);
    });

    it("disconnect cancela uma reconexão agendada", async () => {
      const { disconnect } = await startOpen();
      sources()[0].fail();
      disconnect();

      await vi.advanceTimersByTimeAsync(120_000);
      expect(configs).toHaveLength(1);
    });
  });

  describe("eventos", () => {
    it("evento com JSON inválido informa invalid_event sem derrubar a conexão", async () => {
      const { onError, onEvent, onStatus } = await startOpen();
      sources()[0].message("{quebrado");

      expect(onError.mock.calls[0][0].code).toBe("invalid_event");
      expect(onEvent).not.toHaveBeenCalled();
      expect(sources()[0].close).not.toHaveBeenCalled();
      expect(onStatus).not.toHaveBeenCalledWith("reconnecting");
    });

    it("evento que o schema recusa informa invalid_event com o nome do evento", async () => {
      const strict = {
        parse: (): Score => {
          throw new Error("schema");
        },
      };
      const { onError, onEvent } = start({ schema: strict, eventNames: ["score"] });
      await flush();
      sources()[0].message("{}", "score");

      expect(onEvent).not.toHaveBeenCalled();
      expect(onError.mock.calls[0][0].code).toBe("invalid_event");
      expect(onError.mock.calls[0][0].message).toContain("score");
    });

    it("erro lançado pelo onEvent não é confundido com evento inválido", async () => {
      const { onError } = await startOpen({
        onEvent: () => {
          throw new Error("boom");
        },
      });

      expect(() => sources()[0].message('{"score":1}')).toThrow("boom");
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("heartbeat (staleAfterMs)", () => {
    it("reconecta quando nenhum evento chega dentro da janela", async () => {
      const { onStatus } = await startOpen({ staleAfterMs: 10_000 });

      await vi.advanceTimersByTimeAsync(9_999);
      expect(sources()[0].close).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);

      expect(sources()[0].close).toHaveBeenCalled();
      expect(onStatus).toHaveBeenLastCalledWith("reconnecting");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(sources()).toHaveLength(2);
    });

    it("cada evento recebido renova a janela", async () => {
      await startOpen({ staleAfterMs: 10_000 });

      await vi.advanceTimersByTimeAsync(6_000);
      sources()[0].message('{"score":1}');
      await vi.advanceTimersByTimeAsync(6_000);
      expect(sources()[0].close).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(4_000);
      expect(sources()[0].close).toHaveBeenCalled();
    });

    it("evento inválido também prova que a conexão está viva", async () => {
      await startOpen({ staleAfterMs: 10_000 });

      await vi.advanceTimersByTimeAsync(6_000);
      sources()[0].message("{quebrado");
      await vi.advanceTimersByTimeAsync(6_000);

      expect(sources()[0].close).not.toHaveBeenCalled();
    });

    it("sem staleAfterMs a conexão nunca é considerada parada", async () => {
      await startOpen();

      await vi.advanceTimersByTimeAsync(600_000);
      expect(sources()[0].close).not.toHaveBeenCalled();
    });

    it("evento heartbeat renova a janela sem chegar ao onEvent", async () => {
      const { onEvent } = await startOpen({ staleAfterMs: 10_000 });

      await vi.advanceTimersByTimeAsync(6_000);
      sources()[0].message("{}", "heartbeat");
      await vi.advanceTimersByTimeAsync(6_000);

      expect(sources()[0].close).not.toHaveBeenCalled();
      expect(onEvent).not.toHaveBeenCalled();
    });

    it("disconnect cancela o monitoramento", async () => {
      const { disconnect, onStatus } = await startOpen({ staleAfterMs: 10_000 });
      disconnect();

      await vi.advanceTimersByTimeAsync(60_000);
      expect(onStatus).not.toHaveBeenCalledWith("reconnecting");
    });
  });

  describe("connectRealtime", () => {
    async function freshConnect() {
      vi.resetModules();
      const { default: freshAxios } = await import("axios");
      freshAxios.defaults.adapter = adapter;
      const session = await import("@/core/auth/session-store");
      const { connectRealtime } = await import("./realtime-client");
      return { connectRealtime, session };
    }

    it("envia o Bearer do access token quando há sessão", async () => {
      const { connectRealtime, session } = await freshConnect();
      session.setAccessToken("T1");

      connectRealtime({ channel: { type: "match", id: "1" }, schema, onEvent: vi.fn() });
      await flush();

      expect(configs[0].headers.get("Authorization")).toBe("Bearer T1");
    });

    it("sem sessão o ticket sai anônimo, sem Authorization", async () => {
      const { connectRealtime } = await freshConnect();

      connectRealtime({ channel: { type: "match", id: "1" }, schema, onEvent: vi.fn() });
      await flush();

      expect(configs[0].headers.has("Authorization")).toBe(false);
    });

    it("usa NEXT_PUBLIC_API_URL como baseURL da instância axios", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://env.test");
      vi.resetModules();
      const { default: freshAxios } = await import("axios");
      freshAxios.defaults.adapter = adapter;
      const { connectRealtime } = await import("./realtime-client");

      connectRealtime({ channel: { type: "match", id: "1" }, schema, onEvent: vi.fn() });
      await flush();

      expect(freshAxios.getUri(configs[0])).toBe("https://env.test/api/realtime/ticket");
      expect(sources()[0].url).toBe("https://env.test/api/match/1/live?ticket=abc");
    });
  });
});
