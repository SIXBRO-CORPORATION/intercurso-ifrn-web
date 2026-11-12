import { describe, expect, it } from "vitest"
import { matchDetailSchema } from "../schemas/match-schema"
import { hasNextPeriod, isPeriodEnded, lastCorrectableEvent, playerCards, rowSummary, timelineRows } from "./match-timeline"

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

  it("inverte a ordem somente ao vivo", () => {
    expect(rows({ status: "IN_PROGRESS" })[0].label).toBe("Fim do set 2")
    expect(rows()[0].label).toBe("Gol")
  })
})

describe("playerCards", () => {
  it("conta amarelos e marca expulso só com o evento EXPULSION", () => {
    const cards = playerCards([
      { event_id: "1", event_type: "CARD_YELLOW", clock_seconds: 1, player_id: "a" },
      { event_id: "2", event_type: "CARD_YELLOW", clock_seconds: 2, player_id: "a" },
      { event_id: "3", event_type: "EXPULSION", clock_seconds: 2, player_id: "a" },
      { event_id: "4", event_type: "CARD_RED", clock_seconds: 3, player_id: "b" }, // vermelho sem EXPULSION (desfeita): jogador ativo
      { event_id: "5", event_type: "GOAL", clock_seconds: 4, player_id: "c" },
      { event_id: "6", event_type: "PERIOD_END", clock_seconds: 5, player_id: null },
    ])
    expect(cards.get("a")).toEqual({ yellow: 2, expelled: true })
    expect(cards.get("b")).toEqual({ yellow: 0, expelled: false })
    expect(cards.get("c")).toEqual({ yellow: 0, expelled: false })
    expect(cards.size).toBe(3)
  })
})

describe("isPeriodEnded", () => {
  const event = (event_type: string, i: number) => ({ event_id: `e${i}`, event_type, clock_seconds: i })

  it("é verdadeiro quando o último marcador de período é o fim", () => {
    expect(isPeriodEnded([event("MATCH_STARTED", 1), event("GOAL", 2), event("PERIOD_END", 3)])).toBe(true)
  })

  it("é falso com o período em andamento, mesmo com lances depois do início", () => {
    expect(isPeriodEnded([event("MATCH_STARTED", 1), event("PERIOD_END", 2), event("PERIOD_START", 3), event("GOAL", 4)])).toBe(false)
    expect(isPeriodEnded([event("MATCH_STARTED", 1)])).toBe(false)
    expect(isPeriodEnded([])).toBe(false)
  })
})

describe("hasNextPeriod", () => {
  const event = (event_type: string, i: number) => ({ event_id: `e${i}`, event_type, clock_seconds: i })
  const timeline = [event("MATCH_STARTED", 1), event("PERIOD_END", 2), event("PERIOD_START", 3), event("PERIOD_END", 4)]

  it("é verdadeiro enquanto restam períodos a disputar", () => {
    expect(hasNextPeriod({ timeline: timeline.slice(0, 2), modality_configuration: { num_periods: 2 } })).toBe(true)
  })

  it("é falso quando todos os períodos configurados já terminaram", () => {
    expect(hasNextPeriod({ timeline, modality_configuration: { num_periods: 2 } })).toBe(false)
  })

  it("não bloqueia sem configuração de períodos", () => {
    expect(hasNextPeriod({ timeline, modality_configuration: null })).toBe(true)
    expect(hasNextPeriod({ timeline, modality_configuration: { num_periods: null } })).toBe(true)
  })
})

describe("lastCorrectableEvent", () => {
  const event = (event_id: string, event_type: string, created_at?: string) => ({ event_id, event_type, clock_seconds: 0, created_at })

  it("ignora início/fim de partida e de período", () => {
    const timeline = [event("a", "GOAL"), event("b", "PERIOD_END"), event("c", "MATCH_END")]
    expect(lastCorrectableEvent(timeline)?.event_id).toBe("a")
  })

  it("escolhe o created_at mais recente, não a posição na lista", () => {
    const timeline = [event("novo", "GOAL", "2026-11-12T20:00:00Z"), event("velho", "CARD_YELLOW", "2026-11-12T19:00:00Z")]
    expect(lastCorrectableEvent(timeline)?.event_id).toBe("novo")
  })

  it("sem created_at vale o último da lista; sem evento corrigível não há alvo", () => {
    expect(lastCorrectableEvent([event("a", "GOAL"), event("b", "GOAL")])?.event_id).toBe("b")
    expect(lastCorrectableEvent([event("a", "MATCH_STARTED")])).toBeUndefined()
  })
})

describe("timelineRows: correctable", () => {
  it("marca como não corrigíveis os eventos de início e fim", () => {
    const match = matchDetailSchema.parse({
      ...base,
      timeline: [
        { event_id: "e1", event_type: "MATCH_STARTED", clock_seconds: 0 },
        { event_id: "e2", event_type: "GOAL", clock_seconds: 5 },
      ],
    })
    expect(timelineRows(match).map((r) => r.correctable)).toEqual([false, true])
  })
})

describe("rowSummary", () => {
  it("junta tipo, jogador e tempo", () => {
    expect(rowSummary({ label: "Gol", player: "Lucas", clock: "02:05" })).toBe("Gol · Lucas · 02:05")
    expect(rowSummary({ label: "Fim do set 1", player: null, clock: null })).toBe("Fim do set 1")
  })
})
