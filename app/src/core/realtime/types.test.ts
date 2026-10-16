import { describe, expect, it } from "vitest";

import { RealtimeError } from "./types";

describe("RealtimeError", () => {
  it("carrega código, mensagem e tempo de espera sugerido", () => {
    const error = new RealtimeError("rate_limited", "devagar", 5_000);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("RealtimeError");
    expect(error.code).toBe("rate_limited");
    expect(error.message).toBe("devagar");
    expect(error.retryAfterMs).toBe(5_000);
  });

  it("não exige tempo de espera", () => {
    expect(new RealtimeError("invalid_event", "x").retryAfterMs).toBeUndefined();
  });
});
