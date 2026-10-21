import type { InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"

type Reply = { body?: unknown; status?: number } | Error

const json = (body: unknown, status = 200): Reply => ({ body, status })

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

let replies: Reply[]
let calls: InternalAxiosRequestConfig[]

async function load() {
  vi.resetModules()
  const store = await import("@/core/auth/session-store")
  const { authHttp } = await import("@/lib/axios")
  authHttp.defaults.adapter = async (config) => {
    calls.push(config)
    const reply = replies.shift()
    if (reply instanceof Error) throw reply
    return { data: reply?.body ?? {}, status: reply?.status ?? 200, statusText: "", headers: {}, config }
  }
  const service = await import("./auth-service")
  return { store, service }
}

beforeEach(() => {
  replies = []
  calls = []
})

describe("auth-service", () => {
  it("chamadas simultâneas de refresh fazem UMA requisição (StrictMode/abas)", async () => {
    const { service } = await load()
    replies.push(json({ data: { access_token: "T" } }), json(ME))

    await Promise.all([service.refreshSession(), service.refreshSession()])

    expect(calls.filter((c) => c.url?.endsWith("/refresh"))).toHaveLength(1)
  })

  it("bootstrap com refresh válido autentica e guarda o token só em memória", async () => {
    const { store, service } = await load()
    replies.push(json({ data: { access_token: "T" } }), json(ME))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("authenticated")
    expect(store.getSnapshot().user?.name).toBe("Ana")
    expect(store.getAccessToken()).toBe("T")
    expect(calls[1].url).toBe("/api/auth/me")
    expect(calls[1].headers.get("Authorization")).toBe("Bearer T")
  })

  it("bootstrap com 401 vira anônimo, sem token", async () => {
    const { store, service } = await load()
    replies.push(json({ detail: "x" }, 401))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("anonymous")
    expect(store.getAccessToken()).toBeNull()
  })

  it("falha de rede no bootstrap também resulta em anônimo (rotas públicas seguem)", async () => {
    const { store, service } = await load()
    replies.push(new TypeError("network"))

    await service.bootstrapSession()

    expect(store.getSnapshot().status).toBe("anonymous")
  })

  it("logout limpa o estado local mesmo se a requisição falhar", async () => {
    const { store, service } = await load()
    replies.push(json({ data: { access_token: "T" } }), json(ME))
    await service.bootstrapSession()
    replies.push(new TypeError("network"))

    await service.logout()

    expect(store.getSnapshot().status).toBe("anonymous")
    expect(store.getAccessToken()).toBeNull()
    expect(calls.at(-1)?.url).toBe("/api/auth/logout")
  })
})
