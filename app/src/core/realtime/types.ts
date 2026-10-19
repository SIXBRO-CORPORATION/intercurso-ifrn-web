export type RealtimeStatus = "connecting" | "open" | "reconnecting" | "closed";

export type RealtimeErrorCode =
  | "rate_limited"
  | "ticket_failed"
  | "ticket_rejected"
  | "invalid_event";

export class RealtimeError extends Error {
  constructor(
    readonly code: RealtimeErrorCode,
    message: string,
    readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = "RealtimeError";
  }
}

export type RealtimeChannel = { type: "match" | "season"; id: string };

export type RealtimeSubscription<T> = {
  channel: RealtimeChannel;
  schema: { parse(data: unknown): T };
  eventNames?: string[];
  staleAfterMs?: number;
  onEvent: (data: T, eventName: string) => void;
  onStatus?: (status: RealtimeStatus) => void;
  onReconnect?: () => void;
  onError?: (error: RealtimeError) => void;
};

export type RealtimeConnect = <T>(subscription: RealtimeSubscription<T>) => () => void;
