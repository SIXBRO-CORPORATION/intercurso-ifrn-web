import { describe, expect, it } from "vitest"
import { getGenderRequirements, getTeamCountLabel, getTeamSizeLabel, resolvePhotoSrc } from "./modality-rules"

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

describe("getTeamCountLabel", () => {
  it("inclui o limite quando existe", () => {
    expect(getTeamCountLabel(7, 10)).toBe("7/10 integrantes")
    expect(getTeamCountLabel(1, 10)).toBe("1/10 integrante")
  })

  it("omite o limite quando ausente", () => {
    expect(getTeamCountLabel(3, null)).toBe("3 integrantes")
  })
})

describe("resolvePhotoSrc", () => {
  it("aceita URL absoluta e caminho da raiz", () => {
    expect(resolvePhotoSrc("https://cdn.exemplo.com/a.png")).toBe("https://cdn.exemplo.com/a.png")
    expect(resolvePhotoSrc(" /uploads/a.png ")).toBe("/uploads/a.png")
  })

  it("devolve null para vazio ou formato inesperado (usa o ícone padrão)", () => {
    expect(resolvePhotoSrc(null)).toBeNull()
    expect(resolvePhotoSrc("   ")).toBeNull()
    expect(resolvePhotoSrc("javascript:alert(1)")).toBeNull()
    expect(resolvePhotoSrc("a.png")).toBeNull()
  })
})
