import { describe, expect, it } from "vitest"
import { getGenderRequirements, getTeamSizeLabel } from "./modality-rules"

describe("getTeamSizeLabel", () => {
  it("mostra faixa quando mínimo e máximo diferem", () => {
    expect(getTeamSizeLabel({ min_members: 5, max_members: 10 })).toBe("5 a 10 jogadores")
  })

  it("mostra valor único e concorda o plural", () => {
    expect(getTeamSizeLabel({ min_members: 2, max_members: 2 })).toBe("2 jogadores")
    expect(getTeamSizeLabel({ min_members: 1, max_members: 1 })).toBe("1 jogador")
  })
})

describe("getGenderRequirements", () => {
  it("só exige composição em modalidades mistas", () => {
    expect(getGenderRequirements({ gender_mode: "MALE", min_male_members: 3, min_female_members: 2 })).toEqual([])
  })

  it("lista mínimos de homens e mulheres com plural correto", () => {
    expect(getGenderRequirements({ gender_mode: "MIXED", min_male_members: 1, min_female_members: 2 })).toEqual([
      "mín. 1 homem",
      "mín. 2 mulheres",
    ])
  })

  it("ignora mínimos nulos ou zerados", () => {
    expect(getGenderRequirements({ gender_mode: "MIXED", min_male_members: 0, min_female_members: null })).toEqual([])
  })
})
