import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { parseFilters, toQuery } from "../utils/match-filters"
import { getMatch, listMatches, startMatch } from "./match-repository"

const match = {
  match_id: "m1",
  bracket_id: null,
  modality_id: "mod1",
  modality_name: "Futsal",
  group_name: "A",
  match_type: null,
  match_category: null,
  status: "IN_PROGRESS",
  scheduled_date: null,
  team1: { team_id: "t1", name: "Info", photo: null, score: 2 },
  team2: null,
  winner_id: null,
  clock_seconds: 120,
  clock_running: true,
  current_period: 1,
}

let reply: unknown
let status: number
let calls: InternalAxiosRequestConfig[]

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

describe("listMatches", () => {
  it("envia os filtros na query e devolve a página validada", async () => {
    reply = { data: { items: [match], total: 1, page: 2, size: 12 } }
    const query = toQuery(parseFilters(new URLSearchParams("season_id=s1&status=FINISHED&page=2")))
    const page = await listMatches(query, new AbortController().signal)
    expect(calls[0].url).toBe("/api/match/")
    expect(String(calls[0].params)).toBe(query.toString())
    expect(String(calls[0].params)).toContain("season_id=s1")
    expect(page.items[0].match_id).toBe("m1")
    expect(page.total).toBe(1)
  })

  it("rejeita resposta fora do contrato", async () => {
    reply = { data: { items: [{ ...match, status: "OUTRO" }], total: 1, page: 1, size: 12 } }
    await expect(listMatches(new URLSearchParams(), new AbortController().signal)).rejects.toThrow()
  })
})

describe("getMatch", () => {
  const signal = new AbortController().signal

  it("busca /api/match/{id} e devolve o detalhe validado", async () => {
    reply = { data: { ...match, sets: [{ set_number: 1, team1_points: 25, team2_points: 20, winner_team_id: "t1" }], team1_players: [], team2_players: [], timeline: [] } }
    const detail = await getMatch("m1", signal)
    expect(calls[0].url).toBe("/api/match/m1")
    expect(detail?.sets).toEqual([{ set_number: 1, team1_points: 25, team2_points: 20 }])
  })

  it.each([404, 422])("traduz %i em null (não encontrada)", async (code) => {
    status = code
    expect(await getMatch("x", signal)).toBeNull()
  })

  it("repassa outros erros", async () => {
    status = 500
    await expect(getMatch("m1", signal)).rejects.toThrow()
  })
})

describe("startMatch", () => {
  it("faz POST em /start e devolve o estado de gestão validado", async () => {
    reply = { data: { ...match, status: "IN_PROGRESS", sets: [], team1_players: [{ user_id: "p1", name: "Lucas", matricula: "123", role: "OWNER" }], team2_players: [], timeline: [] } }
    const detail = await startMatch("m1")
    expect(calls[0].method).toBe("post")
    expect(calls[0].url).toBe("/api/match/m1/start")
    expect(detail.status).toBe("IN_PROGRESS")
    expect(detail.team1_players).toEqual([{ user_id: "p1", name: "Lucas" }])
  })

  it("repassa o erro do backend", async () => {
    status = 400
    await expect(startMatch("m1")).rejects.toThrow()
  })
})
