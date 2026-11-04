import { describe, expect, it } from "vitest"
import { matchWinner, setSuggestion, setTarget } from "./match-sets"

const team = (id: string, score: number, sets_won = 0) => ({ team_id: id, name: id, photo: null, score, sets_won })

const match = (s1: number, s2: number, finished = 0, w1 = 0, w2 = 0) => ({
  team1: team("t1", s1, w1),
  team2: team("t2", s2, w2),
  sets: Array.from({ length: finished }, (_, i) => ({ set_number: i + 1, team1_points: 25, team2_points: 20 })),
  modality_configuration: { sets_to_win: 3 },
})

describe("setTarget", () => {
  it("usa 25 pontos nos sets comuns e 15 no set decisivo", () => {
    expect(setTarget(match(0, 0, 0))).toBe(25)
    expect(setTarget(match(0, 0, 3))).toBe(25)
    expect(setTarget(match(0, 0, 4))).toBe(15)
  })
})

describe("setSuggestion", () => {
  it("sugere com 25 pontos e 2 de diferença", () => {
    expect(setSuggestion(match(25, 23))).toMatchObject({ winner: { team_id: "t1" }, number: 1 })
    expect(setSuggestion(match(18, 25))).toMatchObject({ winner: { team_id: "t2" } })
  })

  it("não sugere sem diferença de 2 ou abaixo da meta", () => {
    expect(setSuggestion(match(25, 24))).toBeNull()
    expect(setSuggestion(match(24, 22))).toBeNull()
  })

  it("segue em frente após 24 a 24 até abrir 2 pontos", () => {
    expect(setSuggestion(match(26, 25))).toBeNull()
    expect(setSuggestion(match(27, 25))).not.toBeNull()
  })

  it("usa 15 pontos no set decisivo", () => {
    expect(setSuggestion(match(15, 13, 4))).not.toBeNull()
    expect(setSuggestion(match(15, 14, 4))).toBeNull()
  })

  it("ignora partida sem os dois times", () => {
    expect(setSuggestion({ ...match(25, 0), team2: null })).toBeNull()
  })
})

describe("matchWinner", () => {
  it("retorna o time que atingiu os sets necessários", () => {
    expect(matchWinner(match(0, 0, 3, 3, 1))?.winner.team_id).toBe("t1")
    expect(matchWinner(match(0, 0, 3, 1, 3))?.winner.team_id).toBe("t2")
  })

  it("não retorna enquanto ninguém atingiu a meta", () => {
    expect(matchWinner(match(0, 0, 3, 2, 1))).toBeNull()
  })

  it("não retorna sem configuração de sets", () => {
    expect(matchWinner({ ...match(0, 0, 3, 3, 0), modality_configuration: null })).toBeNull()
  })
})
