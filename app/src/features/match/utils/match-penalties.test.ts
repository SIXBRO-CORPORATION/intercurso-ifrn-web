import { describe, expect, it } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { hasShootout, isGroupTie, isKnockoutTie, penaltyWinner, withPenalties } from "./match-penalties"

describe("empates", () => {
  it("distingue mata-mata e grupos", () => {
    expect(isKnockoutTie(makeMatch({ score: [1, 1], setsWon: null, category: "KNOCKOUT" }))).toBe(true)
    expect(isKnockoutTie(makeMatch({ score: [1, 1], setsWon: null, category: "GROUP" }))).toBe(false)
    expect(isGroupTie(makeMatch({ score: [1, 1], setsWon: null, category: "GROUP" }))).toBe(true)
  })

  it("não considera empate com placar diferente nem no vôlei", () => {
    expect(isKnockoutTie(makeMatch({ score: [2, 1], setsWon: null, category: "KNOCKOUT" }))).toBe(false)
    expect(isKnockoutTie(makeMatch({ score: [0, 0], setsWon: [1, 1], category: "KNOCKOUT" }))).toBe(false)
  })
})

describe("pênaltis", () => {
  it("detecta disputa pelo placar de pênaltis dos dois times", () => {
    expect(hasShootout(makeMatch({ penalty: [5, 4] }))).toBe(true)
    expect(hasShootout(makeMatch())).toBe(false)
  })

  it("formata o placar como X(p)", () => {
    const { team1 } = makeMatch({ score: [2, 2], penalty: [5, 4] })
    expect(withPenalties(2, team1, true)).toBe("2(5)")
    expect(withPenalties(2, team1, false)).toBe("2")
  })

  it("define o vencedor pelos pênaltis e não define em igualdade", () => {
    expect(penaltyWinner(makeMatch({ penalty: [5, 4] }))?.team_id).toBe("t1")
    expect(penaltyWinner(makeMatch({ penalty: [3, 4] }))?.team_id).toBe("t2")
    expect(penaltyWinner(makeMatch({ penalty: [4, 4] }))).toBeNull()
  })
})
