import { describe, expect, it } from "vitest"
import { matchFiltersFormSchema } from "./match-filters-schema"

const base = { status: "", date_from: "", date_to: "" }

describe("matchFiltersFormSchema", () => {
  it("aceita filtros vazios, status válido e intervalo coerente", () => {
    expect(matchFiltersFormSchema.safeParse(base).success).toBe(true)
    expect(matchFiltersFormSchema.safeParse({ ...base, status: "FINISHED" }).success).toBe(true)
    expect(matchFiltersFormSchema.safeParse({ ...base, date_from: "2026-10-01", date_to: "2026-10-01" }).success).toBe(true)
  })

  it("rejeita status desconhecido e intervalo invertido", () => {
    expect(matchFiltersFormSchema.safeParse({ ...base, status: "X" }).success).toBe(false)
    const inverted = matchFiltersFormSchema.safeParse({ ...base, date_from: "2026-10-02", date_to: "2026-10-01" })
    expect(inverted.success).toBe(false)
    expect(inverted.error?.issues[0].path).toEqual(["date_to"])
  })
})
