import { describe, expect, it } from "vitest"
import { matchListSchema } from "./match-schema"

const team = { team_id: "t1", name: "Informática", photo: null, score: 2, sets_won: 0, penalty_score: 0 }

const match = {
  match_id: "m1",
  bracket_id: "b1",
  modality_id: "mod1",
  modality_name: "Futsal",
  group_name: null,
  match_type: "SEMIFINAL",
  match_category: "MASCULINO",
  status: "SCHEDULED",
  scheduled_date: "2026-10-22T15:30:00Z",
  team1: team,
  team2: null,
  winner_id: null,
  clock_seconds: 0,
  clock_running: false,
  current_period: null,
}

const page = (items: unknown[]) => ({ success_bool: true, data: { items, total: items.length, page: 1, size: 12 } })

describe("matchListSchema", () => {
  it("aceita time nulo e devolve a página do envelope", () => {
    expect(matchListSchema.parse(page([match])).data).toEqual({ items: [match], total: 1, page: 1, size: 12 })
  })

  it("aceita sets_won e penalty_score ausentes", () => {
    const { sets_won, penalty_score, ...bare } = team
    void sets_won
    void penalty_score
    expect(() => matchListSchema.parse(page([{ ...match, team1: bare }]))).not.toThrow()
  })

  it("rejeita status inválido, campo obrigatório ausente e data nulo", () => {
    expect(() => matchListSchema.parse(page([{ ...match, status: "XYZ" }]))).toThrow()
    expect(() => matchListSchema.parse(page([{ ...match, clock_running: undefined }]))).toThrow()
    expect(() => matchListSchema.parse({ data: null })).toThrow()
  })
})
