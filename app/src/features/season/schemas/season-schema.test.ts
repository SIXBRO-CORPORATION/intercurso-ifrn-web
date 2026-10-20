import { describe, expect, it } from "vitest"
import { activeSeasonsSchema } from "./season-schema"

const season = { season_id: "s1", name: "Intercurso 2026", year: 2026, status: "IN_PROGRESS", active: true }

describe("activeSeasonsSchema", () => {
  it("aceita lista e ignora campos extras", () => {
    expect(activeSeasonsSchema.parse({ success_bool: true, data: [{ ...season, registration_start_date: "x" }] })).toEqual([season])
  })

  it("normaliza uma temporada única para lista", () => {
    expect(activeSeasonsSchema.parse({ data: season })).toEqual([season])
  })

  it("trata data nulo como nenhuma temporada ativa", () => {
    expect(activeSeasonsSchema.parse({ data: null })).toEqual([])
  })

  it("rejeita status desconhecido e campo obrigatório ausente", () => {
    expect(() => activeSeasonsSchema.parse({ data: [{ ...season, status: "OUTRO" }] })).toThrow()
    expect(() => activeSeasonsSchema.parse({ data: [{ ...season, year: undefined }] })).toThrow()
  })
})