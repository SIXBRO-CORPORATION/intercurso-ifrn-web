import { describe, expect, it } from "vitest"
import { parseFilters, toApiQuery, toQuery, withFilters } from "./match-filters"

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

  it("volta para a página 1 ao mudar filtro, mas respeita troca de página", () => {
    const f = parseFilters(new URLSearchParams("page=4"))
    expect(withFilters(f, { status: "FINISHED" })).toMatchObject({ status: "FINISHED", page: 1 })
    expect(withFilters(f, { page: 5 }).page).toBe(5)
  })

  it("converte o intervalo de datas para o dia local inteiro", () => {
    const q = toApiQuery(new URLSearchParams("date_from=2026-10-23&date_to=2026-10-24&status=FINISHED"))
    const from = new Date(q.get("date_from")!)
    const to = new Date(q.get("date_to")!)
    expect([from.getDate(), from.getHours(), from.getMinutes()]).toEqual([23, 0, 0])
    expect([to.getDate(), to.getHours(), to.getMinutes(), to.getSeconds()]).toEqual([24, 23, 59, 59])
    expect(q.get("status")).toBe("FINISHED")
  })

  it("mantém a query intacta sem datas válidas", () => {
    expect(toApiQuery(new URLSearchParams("date_to=xx&page=2")).toString()).toBe("date_to=xx&page=2")
  })
})
