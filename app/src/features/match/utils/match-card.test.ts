import { describe, expect, it } from "vitest"
import { formatScheduledDate, periodLabel, phaseLabel } from "./match-card"

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
