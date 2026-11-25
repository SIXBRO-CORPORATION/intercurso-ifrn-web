import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SeasonList } from "./season-list"

const state = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock("../hooks/use-seasons", () => ({ useSeasons: () => state.value }))

const season = {
  season_id: "s1",
  name: "Intercurso 2026",
  year: 2026,
  status: "REGISTRATION_OPEN",
  active: true,
  registration_start_date: "2026-03-01T08:00:00",
  registration_end_date: "2026-03-20T23:59:00",
}

describe("SeasonList", () => {
  beforeEach(() => {
    state.value = { isPending: false, isError: false, data: [] }
  })

  it("mostra carregamento, erro e vazio", () => {
    state.value = { isPending: true }
    const { rerender } = render(<SeasonList />)
    expect(screen.getByRole("status").textContent).toContain("Carregando temporadas")

    state.value = { isPending: false, isError: true, refetch: vi.fn() }
    rerender(<SeasonList />)
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeTruthy()

    state.value = { isPending: false, isError: false, data: [] }
    rerender(<SeasonList />)
    expect(screen.getByText("Nenhuma temporada cadastrada.")).toBeTruthy()
  })

  it("lista nome, ano, status e período com link para o detalhe", () => {
    state.value = { isPending: false, isError: false, data: [season] }
    render(<SeasonList />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/temporadas/s1")
    expect(link.textContent).toContain("Intercurso 2026")
    expect(link.textContent).toContain("2026")
    expect(link.textContent).toContain("Inscrições abertas")
    expect(link.textContent).toContain("Inscrições: 01/03/2026 a 20/03/2026")
  })
})
