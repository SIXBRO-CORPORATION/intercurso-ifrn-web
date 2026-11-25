import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SeasonDetailView } from "./season-detail-view"

const detail = {
  season_id: "s1",
  name: "Intercurso 2026",
  year: 2026,
  status: "DRAFT",
  active: false,
  modality_ids: ["m1"],
  rules_document: "https://x/r.pdf" as string | null,
}
vi.mock("../hooks/use-seasons", () => ({ useSeason: () => ({ isPending: false, isError: false, data: detail }) }))
vi.mock("@/features/modality", () => ({
  useModalities: () => ({ isPending: false, isError: false, data: [{ modality_id: "m1", name: "Futsal" }] }),
}))

describe("SeasonDetailView", () => {
  it("mostra status, modalidades e link do regulamento", () => {
    render(<SeasonDetailView id="s1" />)
    expect(screen.getByText("Rascunho")).toBeTruthy()
    expect(screen.getByText("Futsal")).toBeTruthy()
    expect(screen.getByRole("link", { name: /Regulamento/ }).getAttribute("href")).toBe("https://x/r.pdf")
  })

  it("omite o regulamento quando não há documento", () => {
    detail.rules_document = null
    render(<SeasonDetailView id="s1" />)
    expect(screen.queryByRole("link", { name: /Regulamento/ })).toBeNull()
  })
})
