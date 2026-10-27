import { AxiosError } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { getActiveSeason } from "./season-repository"

const season = { season_id: "s1", name: "Intercurso 2026", year: 2026, status: "IN_PROGRESS", active: true }
const signal = new AbortController().signal

let reply: unknown
let status: number

beforeEach(() => {
  status = 200
  api.defaults.adapter = async (config) => {
    const response = { data: reply, status, statusText: "", headers: {}, config }
    if (status >= 400) throw new AxiosError("fail", "ERR_BAD_REQUEST", config, null, response)
    return response
  }
})

describe("getActiveSeason", () => {
  it("devolve a temporada validada", async () => {
    reply = { data: season }
    expect((await getActiveSeason(signal))?.season_id).toBe("s1")
  })

  it("traduz 404 (nenhuma temporada cadastrada) em null", async () => {
    status = 404
    expect(await getActiveSeason(signal)).toBeNull()
  })

  it("repassa outros erros", async () => {
    status = 500
    await expect(getActiveSeason(signal)).rejects.toThrow()
  })
})
