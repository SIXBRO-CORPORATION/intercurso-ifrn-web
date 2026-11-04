import { describe, expect, it } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { finishResult, matchWinnerTeam } from "./match-finish"

describe("finishResult", () => {
  it("usa o placar de gols e define o vencedor", () => {
    const match = makeMatch({ score: [2, 1], setsWon: null })
    const result = finishResult(match)

    expect(result?.sets).toBe(false)
    expect([result?.score1, result?.score2]).toEqual([2, 1])
    expect(result?.winner?.team_id).toBe("t1")
  })

  it("define o segundo time como vencedor quando ele está à frente", () => {
    expect(finishResult(makeMatch({ score: [0, 3], setsWon: null }))?.winner?.team_id).toBe("t2")
  })

  it("não define vencedor em empate", () => {
    expect(finishResult(makeMatch({ score: [1, 1], setsWon: null }))?.winner).toBeNull()
  })

  it("usa os sets vencidos no vôlei, ignorando o placar do set", () => {
    const result = finishResult(makeMatch({ score: [0, 0], setsWon: [3, 1] }))

    expect(result?.sets).toBe(true)
    expect([result?.score1, result?.score2]).toEqual([3, 1])
    expect(result?.winner?.team_id).toBe("t1")
  })

  it("não define vencedor com sets empatados", () => {
    expect(finishResult(makeMatch({ setsWon: [1, 1] }))?.winner).toBeNull()
  })

  it("devolve null enquanto um dos times não está definido", () => {
    expect(finishResult({ ...makeMatch(), team2: null })).toBeNull()
  })
})

describe("matchWinnerTeam", () => {
  it("encontra o time pelo winner_id", () => {
    expect(matchWinnerTeam({ ...makeMatch(), winner_id: "t2" })?.name).toBe("Tigres")
  })

  it("devolve null sem vencedor ou com id desconhecido", () => {
    expect(matchWinnerTeam(makeMatch())).toBeNull()
    expect(matchWinnerTeam({ ...makeMatch(), winner_id: "x" })).toBeNull()
  })
})
