import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { clearSession, setAccessToken } from "@/core/auth/session-store"
import { api, setRefreshHandler } from "./axios"

let statuses: number[]
let calls: InternalAxiosRequestConfig[]

const authOf = (config: InternalAxiosRequestConfig) => config.headers.get("Authorization")

beforeEach(() => {
  clearSession()
  statuses = []
  calls = []
  api.defaults.adapter = async (config) => {
    calls.push(config)
    const status = statuses.shift() ?? 200
    const response = { data: null, status, statusText: "", headers: {}, config } as AxiosResponse
    if (status >= 400) throw new AxiosError("fail", AxiosError.ERR_BAD_REQUEST, config, null, response)
    return response
  }
})

describe("api", () => {
  it("anexa o Bearer quando há access token em memória", async () => {
    setAccessToken("T1")
    await api.get("/api/x")
    expect(authOf(calls[0])).toBe("Bearer T1")
  })

  it("num 401 renova o token uma vez e repete a requisição com o novo", async () => {
    setAccessToken("VELHO")
    const refresh = vi.fn(async () => {
      setAccessToken("NOVO")
      return true
    })
    setRefreshHandler(refresh)
    statuses = [401, 200]

    const res = await api.get("/api/x")

    expect(res.status).toBe(200)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(authOf(calls[1])).toBe("Bearer NOVO")
  })

  it("se a renovação falha, propaga o 401 original sem repetir", async () => {
    setAccessToken("VELHO")
    setRefreshHandler(async () => false)
    statuses = [401]

    await expect(api.get("/api/x")).rejects.toMatchObject({ response: { status: 401 } })
    expect(calls).toHaveLength(1)
  })

  it("não entra em loop quando a requisição repetida também recebe 401", async () => {
    setAccessToken("VELHO")
    const refresh = vi.fn(async () => true)
    setRefreshHandler(refresh)
    statuses = [401, 401]

    await expect(api.get("/api/x")).rejects.toMatchObject({ response: { status: 401 } })
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(calls).toHaveLength(2)
  })

  it("visitante anônimo recebe 401 sem tentar renovar", async () => {
    const refresh = vi.fn(async () => true)
    setRefreshHandler(refresh)
    statuses = [401]

    await expect(api.get("/api/x")).rejects.toMatchObject({ response: { status: 401 } })
    expect(refresh).not.toHaveBeenCalled()
  })
})
