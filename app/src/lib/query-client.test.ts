import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"
import { shouldRetry } from "./query-client"

function httpError(status: number) {
  const response = { status, data: null, statusText: "", headers: {}, config: { headers: new AxiosHeaders() } } as AxiosResponse
  return new AxiosError("falha", String(status), undefined, undefined, response)
}

describe("shouldRetry", () => {
  it("não repete erros 4xx", () => {
    expect(shouldRetry(0, httpError(404))).toBe(false)
    expect(shouldRetry(0, httpError(429))).toBe(false)
  })

  it("repete erros 5xx até o limite", () => {
    expect(shouldRetry(0, httpError(503))).toBe(true)
    expect(shouldRetry(1, httpError(503))).toBe(true)
    expect(shouldRetry(2, httpError(503))).toBe(false)
  })

  it("repete falhas de rede e erros desconhecidos até o limite", () => {
    expect(shouldRetry(0, new AxiosError("Network Error"))).toBe(true)
    expect(shouldRetry(0, new Error("x"))).toBe(true)
    expect(shouldRetry(2, new Error("x"))).toBe(false)
  })
})
