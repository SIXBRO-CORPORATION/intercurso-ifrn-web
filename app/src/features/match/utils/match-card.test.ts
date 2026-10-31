import { describe, expect, it } from "vitest"
import { clockLimit, formatClock, formatClockWithExtra, formatScheduledDate, formatScheduledSlot, periodLabel, phaseLabel, roundLabel, scoreActionLabel, stageLabel } from "./match-card"

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

describe("formatScheduledSlot", () => {
  it("devolve null sem data ou com data inválida", () => {
    expect(formatScheduledSlot(null)).toBeNull()
    expect(formatScheduledSlot("não é data")).toBeNull()
  })

  it("separa dia e hora", () => {
    expect(formatScheduledSlot("2026-10-20T15:30:00")).toEqual({ date: "20/10", time: "15:30" })
  })

  it("omite a hora quando vem só a data", () => {
    expect(formatScheduledSlot("2026-10-20")).toEqual({ date: "20/10", time: null })
  })
})

describe("roundLabel e stageLabel", () => {
  it("traduz tipos especiais e ignora partidas regulares", () => {
    expect(roundLabel({ match_type: "SEMIFINAL" })).toBe("Semifinal")
    expect(roundLabel({ match_type: "REGULAR" })).toBeNull()
    expect(roundLabel({ match_type: null })).toBeNull()
  })

  it("prefere o grupo e cai para a categoria", () => {
    expect(stageLabel({ group_name: "Grupo B", match_category: "GROUP" })).toBe("Grupo B")
    expect(stageLabel({ group_name: null, match_category: "KNOCKOUT" })).toBe("Mata-mata")
    expect(stageLabel({ group_name: null, match_category: null })).toBeNull()
  })
})

describe("clockLimit", () => {
  const futsal = { score_type: "GOALS", period_durations_minutes: 20 }

  it("acumula a duração dos períodos já iniciados", () => {
    expect(clockLimit(futsal, 1)).toBe(1200)
    expect(clockLimit(futsal, 2)).toBe(2400)
    expect(clockLimit(futsal, null)).toBe(1200)
  })

  it("não limita vôlei nem modalidade desconhecida", () => {
    expect(clockLimit({ score_type: "SETS", period_durations_minutes: 90 }, 1)).toBeNull()
    expect(clockLimit(undefined, 1)).toBeNull()
  })
})

describe("formatClockWithExtra", () => {
  it("não separa acréscimos sem limite ou dentro do tempo", () => {
    expect(formatClockWithExtra(754, null)).toEqual({ main: "12:34", extra: null })
    expect(formatClockWithExtra(1200, 1200)).toEqual({ main: "20:00", extra: null })
  })

  it("separa o que passou do limite em acréscimos", () => {
    expect(formatClockWithExtra(1325, 1200)).toEqual({ main: "20:00", extra: "02:05" })
    expect(formatClockWithExtra(2465, 2400)).toEqual({ main: "40:00", extra: "01:05" })
  })
})

describe("scoreActionLabel", () => {
  const team = { team_id: "t", name: "T", photo: null, score: 0 }

  it("usa Gol por padrão e Ponto para pontuação por pontos", () => {
    expect(scoreActionLabel({ team1: team, modality_configuration: { score_type: "GOALS" } })).toBe("Gol")
    expect(scoreActionLabel({ team1: team, modality_configuration: null })).toBe("Gol")
    expect(scoreActionLabel({ team1: team, modality_configuration: { score_type: "POINTS" } })).toBe("Ponto")
  })

  it("usa Ponto no vôlei", () => {
    expect(scoreActionLabel({ team1: { ...team, sets_won: 0 }, modality_configuration: { score_type: "SETS" } })).toBe("Ponto")
  })
})
