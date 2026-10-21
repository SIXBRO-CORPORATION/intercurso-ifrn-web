import { beforeEach, describe, expect, it, vi } from "vitest"
import { fetchActiveSeason, parseActiveSeason } from "./season-service"

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

const SEASON = {
  season_id: "s1",
  name: "Intercurso 2026",
  year: 2026,
  status: "IN_PROGRESS",
  active: true,
  registration_start_date: "2026-09-01T08:00:00",
  registration_end_date: "2026-09-20T18:00:00",
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

describe("parseActiveSeason", () => {
  it("converte o payload da API no modelo interno", () => {
    const season = parseActiveSeason(SEASON)

    expect(season).toMatchObject({
      id: "s1",
      name: "Intercurso 2026",
      year: 2026,
      status: "IN_PROGRESS",
    })
    expect(season?.registrationStartDate).toBeInstanceOf(Date)
    expect(season?.registrationEndDate).toBeInstanceOf(Date)
  })

  it("aceita datas de inscrição ausentes ou inválidas como null", () => {
    const season = parseActiveSeason({
      ...SEASON,
      registration_start_date: null,
      registration_end_date: "não é data",
    })

    expect(season?.registrationStartDate).toBeNull()
    expect(season?.registrationEndDate).toBeNull()
  })

  it.each([null, undefined, "x", 1, {}, { ...SEASON, name: 5 }, { ...SEASON, year: "2026" }])(
    "rejeita payload inválido (%j)",
    (payload) => {
      expect(parseActiveSeason(payload)).toBeNull()
    },
  )
})

describe("fetchActiveSeason", () => {
  it("200 com temporada vira sucesso e chama o endpoint público", async () => {
    fetchMock.mockResolvedValueOnce(json({ success_bool: true, data: SEASON }))

    const outcome = await fetchActiveSeason()

    expect(outcome.kind).toBe("success")
    if (outcome.kind === "success") expect(outcome.season.name).toBe("Intercurso 2026")
    expect(fetchMock.mock.calls[0][0]).toBe("/api/season/active")
    expect(new Headers(fetchMock.mock.calls[0][1].headers).has("Authorization")).toBe(false)
  })

  it("404 NOT_FOUND vira 'sem temporada ativa'", async () => {
    fetchMock.mockResolvedValueOnce(
      json(
        { success_bool: false, error: "Nenhuma temporada ativa no momento", code: "NOT_FOUND" },
        404,
      ),
    )

    expect(await fetchActiveSeason()).toEqual({ kind: "none" })
  })

  it("404 sem o código NOT_FOUND (rota errada, proxy) é erro, não 'sem temporada'", async () => {
    fetchMock.mockResolvedValueOnce(json({ detail: "Not Found" }, 404))

    expect(await fetchActiveSeason()).toEqual({ kind: "error" })
  })

  it("500 vira erro", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ success_bool: false, error: "x", code: "INTERNAL_ERROR" }, 500),
    )

    expect(await fetchActiveSeason()).toEqual({ kind: "error" })
  })

  it("falha de rede vira erro", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("network"))

    expect(await fetchActiveSeason()).toEqual({ kind: "error" })
  })

  it("200 com corpo inválido vira erro", async () => {
    fetchMock.mockResolvedValueOnce(json({ success_bool: true, data: { name: "x" } }))

    expect(await fetchActiveSeason()).toEqual({ kind: "error" })
  })

  it("200 com corpo que não é JSON vira erro", async () => {
    fetchMock.mockResolvedValueOnce(new Response("<html>", { status: 200 }))

    expect(await fetchActiveSeason()).toEqual({ kind: "error" })
  })
})
