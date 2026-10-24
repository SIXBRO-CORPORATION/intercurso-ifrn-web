import { describe, expect, it } from "vitest"
import { matchDetailSchema } from "../schemas/match-schema"
import { timelineRows } from "./match-timeline"

const base = {
  match_id: "m1", bracket_id: null, modality_id: "mod", modality_name: "Futsal", group_name: null,
  match_type: null, match_category: null, status: "FINISHED", scheduled_date: null,
  team1: { team_id: "t1", name: "Info", photo: null, score: 1 },
  team2: { team_id: "t2", name: "Edif", photo: null, score: 0 },
  winner_id: "t1", clock_seconds: 0, clock_running: false, current_period: 2, sets: [],
  team1_players: [{ user_id: "p1", name: "Lucas", matricula: "2020123" }],
  team2_players: [],
  timeline: [
    { event_id: "e1", event_type: "GOAL", clock_seconds: 125, team_id: "t1", player_id: "p1" },
    { event_id: "e2", event_type: "CARD_YELLOW", clock_seconds: 300, team_id: "t2", player_id: "fora" },
    { event_id: "e3", event_type: "NOVO_TIPO", clock_seconds: 301, team_id: null, player_id: null },
    { event_id: "e4", event_type: "SET_END", clock_seconds: 600, team_id: null, player_id: null },
    { event_id: "e5", event_type: "SET_END", clock_seconds: 900, team_id: null, player_id: null },
  ],
}

describe("matchDetailSchema", () => {
  it("descarta a matrícula do jogador", () => {
    const { team1_players } = matchDetailSchema.parse(base)
    expect(team1_players).toEqual([{ user_id: "p1", name: "Lucas" }])
  })
})

describe("timelineRows", () => {
  const rows = (patch = {}) => timelineRows(matchDetailSchema.parse({ ...base, ...patch }))

  it("resolve jogador/time, ignora tipo desconhecido e numera os sets", () => {
    const r = rows()
    expect(r.map((x) => x.label)).toEqual(["Gol", "Cartão amarelo", "Fim do set 1", "Fim do set 2"])
    expect(r[0]).toMatchObject({ clock: "02:05", team: "Info", player: "Lucas" })
  })

  it("jogador fora do elenco mostra só o time", () => {
    expect(rows()[1]).toMatchObject({ team: "Edif", player: null })
  })

  it("vôlei não exibe tempo", () => {
    const volley = { team1: { ...base.team1, sets_won: 1 }, team2: { ...base.team2, sets_won: 0 } }
    const r = rows({ ...volley, timeline: [base.timeline[4], base.timeline[3]] })
    expect(r.map((x) => x.clock)).toEqual([null, null])
  })

  it("indica o lado do time e deixa eventos neutros sem lado", () => {
    const r = rows()
    expect(r.map((x) => x.side)).toEqual([1, 2, null, null])
  })

  it("inverte a ordem somente ao vivo", () => {
    expect(rows({ status: "IN_PROGRESS" })[0].label).toBe("Fim do set 2")
    expect(rows()[0].label).toBe("Gol")
  })
})
