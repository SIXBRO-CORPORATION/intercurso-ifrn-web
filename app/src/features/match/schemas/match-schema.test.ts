import { describe, expect, it } from "vitest"
import { matchDetailSchema, matchListSchema } from "./match-schema"

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

describe("matchSchema", () => {
  it("aceita group_name ausente e normaliza para null", () => {
    const rest: Partial<typeof match> = { ...match }
    delete rest.group_name
    expect(matchListSchema.parse(page([rest])).data.items[0].group_name).toBeNull()
  })
})

describe("matchDetailSchema", () => {
  it("aceita o payload real do detalhe, sem group_name nem matrícula", () => {
    const rest: Partial<typeof match> = { ...match }
    delete rest.group_name
    const detail = matchDetailSchema.parse({
      ...rest,
      status: "FINISHED",
      team1: { ...team, sets_won: null, penalty_score: null },
      sets: [],
      team1_players: [{ user_id: "p1", name: "Lucas Silva", role: "OWNER" }],
      team2_players: [],
      timeline: [{ event_id: "e1", event_type: "GOAL", clock_seconds: 450, team_id: "t1", player_id: "p1", created_at: "x", metadata: null }],
    })
    expect(detail.group_name).toBeNull()
    expect(detail.team1_players).toEqual([{ user_id: "p1", name: "Lucas Silva" }])
  })
})