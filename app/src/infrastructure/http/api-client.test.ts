import { beforeEach, describe, expect, it, vi } from "vitest"
import { clearSession, setAccessToken } from "@/core/auth/session-store"
import { apiFetch, setRefreshHandler } from "./api-client"

const res = (status: number) => new Response(null, { status })
const authOf = (call: unknown[]) =>
  new Headers((call[1] as RequestInit).headers).get("Authorization")

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  clearSession()
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

describe("apiFetch", () => {
  it("anexa o Bearer quando há access token em memória", async () => {
    setAccessToken("T1")
    fetchMock.mockResolvedValue(res(200))
    await apiFetch("/api/x")
    expect(authOf(fetchMock.mock.calls[0])).toBe("Bearer T1")
  })

  it("num 401 renova o token uma vez e repete a requisição com o novo", async () => {
    setAccessToken("VELHO")
    const refresh = vi.fn(async () => {
      setAccessToken("NOVO")
      return true
    })
    setRefreshHandler(refresh)
    fetchMock.mockResolvedValueOnce(res(401)).mockResolvedValueOnce(res(200))

    const r = await apiFetch("/api/x")

    expect(r.status).toBe(200)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(authOf(fetchMock.mock.calls[1])).toBe("Bearer NOVO")
  })

  it("se a renovação falha, devolve o 401 original sem repetir", async () => {
    setAccessToken("VELHO")
    setRefreshHandler(async () => false)
    fetchMock.mockResolvedValue(res(401))

    const r = await apiFetch("/api/x")

    expect(r.status).toBe(401)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("visitante anônimo recebe 401 sem tentar renovar", async () => {
    const refresh = vi.fn(async () => true)
    setRefreshHandler(refresh)
    fetchMock.mockResolvedValue(res(401))

    await apiFetch("/api/x")

    expect(refresh).not.toHaveBeenCalled()
  })
})
