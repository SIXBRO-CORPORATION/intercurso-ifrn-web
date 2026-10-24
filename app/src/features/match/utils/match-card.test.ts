import { describe, expect, it } from "vitest"
import { formatClock, formatKickoff, formatScheduledDate, isVolleyMatch, periodLabel, phaseLabel, scoreOf } from "./match-card"

describe("formatScheduledDate", () => {
  it("devolve null sem data ou com data inválida", () => {
    expect(formatScheduledDate(null)).toBeNull()
    expect(formatScheduledDate("não é data")).toBeNull()
  })

  it("formata data e hora em pt-BR", () => {
    expect(formatScheduledDate("2026-10-20T12:00:00Z")).toMatch(/20\/10\/2026.*\d{2}:\d{2}/)
  })

  it("não desloca o dia quando vem só a data", () => {
    expect(formatScheduledDate("2026-10-20")).toBe("20/10/2026")
  })
})

describe("phaseLabel", () => {
  it("prefere o grupo e cai para o tipo da partida", () => {
    expect(phaseLabel({ group_name: "A", match_type: "GROUP" })).toBe("A")
    expect(phaseLabel({ group_name: null, match_type: "FINAL" })).toBe("FINAL")
    expect(phaseLabel({ group_name: null, match_type: null })).toBeNull()
  })
})

describe("periodLabel", () => {
  it("devolve null sem período e formata o número quando existe", () => {
    expect(periodLabel(null)).toBeNull()
    expect(periodLabel(0)).toBeNull()
    expect(periodLabel(2)).toBe("2º período")
  })
})

describe("formatClock", () => {
  it("formata mm:ss e tolera nulo/negativo", () => {
    expect(formatClock(754)).toBe("12:34")
    expect(formatClock(5)).toBe("00:05")
    expect(formatClock(null)).toBe("00:00")
    expect(formatClock(-3)).toBe("00:00")
  })
})

describe("formatKickoff", () => {
  it("devolve null sem data ou inválida", () => {
    expect(formatKickoff(null)).toBeNull()
    expect(formatKickoff("x")).toBeNull()
  })

  it("não inventa horário quando vem só a data", () => {
    expect(formatKickoff("2026-10-20")).toEqual({ date: "20/10", time: null })
  })

  it("separa dia e hora quando há horário", () => {
    expect(formatKickoff("2026-10-20T15:30:00Z")).toMatchObject({ date: expect.stringMatching(/^\d{2}\/\d{2}$/), time: expect.stringMatching(/^\d{2}:\d{2}$/) })
  })
})

describe("scoreOf", () => {
  const team = (patch = {}) => ({ team_id: "t", name: "A", photo: null, score: 3, ...patch })

  it("usa traço sem time ou antes do jogo", () => {
    expect(scoreOf({ status: "SCHEDULED", team1: team() }, team())).toBe("–")
    expect(scoreOf({ status: "FINISHED", team1: null }, null)).toBe("–")
  })

  it("usa o placar do time fora do vôlei", () => {
    expect(scoreOf({ status: "FINISHED", team1: team() }, team())).toBe(3)
  })

  it("usa sets vencidos no vôlei", () => {
    const t = team({ sets_won: 2 })
    expect(isVolleyMatch({ team1: t })).toBe(true)
    expect(scoreOf({ status: "IN_PROGRESS", team1: t }, t)).toBe(2)
  })
})
