import type { InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it } from "vitest"
import { api } from "@/lib/axios"
import { parseFilters, toQuery } from "../utils/match-filters"
import { listMatches } from "./match-repository"

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
let calls: InternalAxiosRequestConfig[]

beforeEach(() => {
  calls = []
  api.defaults.adapter = async (config) => {
    calls.push(config)
    return { data: reply, status: 200, statusText: "", headers: {}, config }
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
