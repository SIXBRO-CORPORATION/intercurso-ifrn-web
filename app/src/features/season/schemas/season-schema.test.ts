import { describe, expect, it } from "vitest"
import { activeSeasonSchema } from "./season-schema"

const season = { season_id: "s1", name: "Intercurso 2026", year: 2026, status: "IN_PROGRESS", active: true }

describe("activeSeasonSchema", () => {
  it("aceita a temporada e ignora campos extras", () => {
    expect(activeSeasonSchema.parse({ success_bool: true, data: { ...season, registration_start_date: "x" } }).data).toEqual(season)
  })

  it("aceita a temporada de fallback, que não está mais ativa", () => {
    expect(activeSeasonSchema.parse({ data: { ...season, status: "FINISHED", active: false } }).data?.season_id).toBe("s1")
  })

  it("trata data nulo como nenhuma temporada", () => {
    expect(activeSeasonSchema.parse({ data: null }).data).toBeNull()
  })

  it("rejeita status desconhecido e campo obrigatório ausente", () => {
    expect(() => activeSeasonSchema.parse({ data: { ...season, status: "OUTRO" } })).toThrow()
    expect(() => activeSeasonSchema.parse({ data: { ...season, year: undefined } })).toThrow()
  })
})
