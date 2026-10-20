import { describe, expect, it } from "vitest"
import { parseFilters, toQuery } from "./match-filters"

describe("match filters", () => {
  it("aplica padrões e descarta valores inválidos", () => {
    const f = parseFilters(new URLSearchParams("status=XYZ&page=-2&size=500"))
    expect(f).toMatchObject({ status: "", page: 1, size: 100, season_id: "" })
  })

  it("faz ida e volta pela query string", () => {
    const f = parseFilters(new URLSearchParams("season_id=s1&status=FINISHED&page=3&date_from=2026-10-01"))
    expect(parseFilters(toQuery(f))).toEqual(f)
  })

  it("omite page 1 e size padrão no modo compacto", () => {
    const q = toQuery(parseFilters(new URLSearchParams("season_id=s1")), true)
    expect(q.toString()).toBe("season_id=s1")
  })
})
