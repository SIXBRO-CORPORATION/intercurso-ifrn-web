import { beforeEach, describe, expect, it, vi } from "vitest"

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

const ME = {
  data: {
    user_id: "u1",
    name: "Ana",
    email: "a@x.br",
    matricula: "123",
    role: "USER",
    atleta: true,
  },
}

let fetchMock: ReturnType<typeof vi.fn>

async function load() {
  vi.resetModules()
  const store = await import("@/core/auth/session-store")
  const service = await import("./auth-service")
  return { store, service }
}

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

describe("auth-service", () => {
  it("chamadas simultâneas de refresh fazem UMA requisição (StrictMode/abas)", async () => {
    const { service } = await load()
    fetchMock
      .mockResolvedValueOnce(json({ data: { access_token: "T" } }))
      .mockResolvedValueOnce(json(ME))

    await Promise.all([service.refreshSession(), service.refreshSession()])

    const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/refresh"),
    )
    expect(refreshCalls).toHaveLength(1)
  })

  it("bootstrap com refresh válido autentica e guarda o token só em memória", async () => {
    const { store, service } = await load()
    fetchMock
      .mockResolvedValueOnce(json({ data: { access_token: "T" } }))
      .mockResolvedValueOnce(json(ME))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("authenticated")
    expect(store.getSnapshot().user?.name).toBe("Ana")
    expect(store.getAccessToken()).toBe("T")
    const [meUrl, meInit] = fetchMock.mock.calls[1]
    expect(meUrl).toBe("/api/auth/me")
    expect(new Headers(meInit.headers).get("Authorization")).toBe("Bearer T")
  })

  it("bootstrap com 401 vira anônimo, sem token", async () => {
    const { store, service } = await load()
    fetchMock.mockResolvedValueOnce(json({ detail: "x" }, 401))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("anonymous")
    expect(store.getAccessToken()).toBeNull()
  })

  it("falha de rede no bootstrap também resulta em anônimo (rotas públicas seguem)", async () => {
    const { store, service } = await load()
    fetchMock.mockRejectedValueOnce(new TypeError("network"))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("anonymous")
  })

  it("logout limpa o estado local mesmo se a requisição falhar", async () => {
    const { store, service } = await load()
    fetchMock
      .mockResolvedValueOnce(json({ data: { access_token: "T" } }))
      .mockResolvedValueOnce(json(ME))
    await service.bootstrapSession()
    fetchMock.mockRejectedValueOnce(new TypeError("network"))

    await service.logout()

    expect(store.getSnapshot().status).toBe("anonymous")
    expect(store.getAccessToken()).toBeNull()
    expect(fetchMock.mock.calls.at(-1)?.[0]).toBe("/api/auth/logout")
  })
})
