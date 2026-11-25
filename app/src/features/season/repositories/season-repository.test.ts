import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { getSeason, listSeasons } from "./season-repository"

const season = { season_id: "s1", name: "Intercurso 2026", year: 2026, status: "DRAFT", active: false }

let reply: unknown
let status: number
let calls: InternalAxiosRequestConfig[]
const signal = new AbortController().signal

beforeEach(() => {
  calls = []
  status = 200
  api.defaults.adapter = async (config) => {
    calls.push(config)
    const response = { data: reply, status, statusText: "", headers: {}, config }
    if (status >= 400) throw new AxiosError("fail", "ERR_BAD_REQUEST", config, null, response)
    return response
  }
})

describe("listSeasons", () => {
  it("devolve as temporadas e trata data nulo como lista vazia", async () => {
    reply = { data: [season] }
    expect((await listSeasons(signal))[0].season_id).toBe("s1")
    expect(calls[0].url).toBe("/api/season/")
    reply = { data: null }
    expect(await listSeasons(signal)).toEqual([])
  })

  it("rejeita status desconhecido e repassa erro HTTP", async () => {
    reply = { data: [{ ...season, status: "OUTRO" }] }
    await expect(listSeasons(signal)).rejects.toThrow()
    status = 403
    await expect(listSeasons(signal)).rejects.toThrow()
  })
})

describe("getSeason", () => {
  it("busca pelo id e devolve modalidades e regulamento", async () => {
    reply = { data: { ...season, modality_ids: ["m1"], rules_document: "https://x/r.pdf", extra: 1 } }
    const result = await getSeason("s1", signal)
    expect(calls[0].url).toBe("/api/season/s1")
    expect(result.modality_ids).toEqual(["m1"])
    expect(result.rules_document).toBe("https://x/r.pdf")
  })

  it("rejeita detalhe sem modality_ids", async () => {
    reply = { data: season }
    await expect(getSeason("s1", signal)).rejects.toThrow()
  })
})
