import { describe, expect, it } from "vitest"
import { dayLabel, parseFilters, shiftDay, toApiQuery, toQuery, withFilters } from "./match-filters"

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

  it("rotula o dia filtrado, o intervalo e a ausência de filtro", () => {
    const today = new Date(2026, 4, 21)
    const day = (date_from: string, date_to = date_from) => dayLabel({ date_from, date_to }, today)
    expect([day("2026-05-20"), day("2026-05-21"), day("2026-05-22")]).toEqual(["Ontem", "Hoje", "Amanhã"])
    expect(day("2026-05-25")).toMatch(/25\/05$/)
    expect(day("2026-05-01", "2026-05-10")).toBe("01/05 – 10/05")
    expect([day("2026-05-01", ""), day("", "2026-05-10"), day("")]).toEqual(["Desde 01/05", "Até 10/05", "Todas as datas"])
  })

  it("navega um dia a partir do filtro ou de hoje", () => {
    const today = new Date(2026, 4, 31)
    expect(shiftDay({ date_from: "", date_to: "" }, 1, today)).toEqual({ date_from: "2026-06-01", date_to: "2026-06-01" })
    expect(shiftDay({ date_from: "2026-05-02", date_to: "2026-05-02" }, -1, today)).toEqual({ date_from: "2026-05-01", date_to: "2026-05-01" })
  })

  it("mantém a query intacta sem datas válidas", () => {
    expect(toApiQuery(new URLSearchParams("date_to=xx&page=2")).toString()).toBe("date_to=xx&page=2")
  })
})
