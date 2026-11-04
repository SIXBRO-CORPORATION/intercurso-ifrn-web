import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { SetHistory } from "./set-history"

describe("SetHistory", () => {
  it("avisa quando nenhum set foi encerrado", () => {
    render(<SetHistory match={makeMatch()} />)

    expect(screen.getByRole("heading", { name: "Histórico de sets" })).toBeTruthy()
    expect(screen.getByText("Nenhum set encerrado ainda.")).toBeTruthy()
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })

  it("lista os sets encerrados em ordem com o placar de cada time", () => {
    const sets = [
      { set_number: 1, team1_points: 25, team2_points: 23 },
      { set_number: 2, team1_points: 21, team2_points: 25 },
    ]
    render(<SetHistory match={makeMatch({ sets })} />)

    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toBe("Set 1Falcões 25 – 23 Tigres")
    expect(items[1].textContent).toBe("Set 2Falcões 21 – 25 Tigres")
    expect(screen.queryByText("Nenhum set encerrado ainda.")).toBeNull()
  })
})
