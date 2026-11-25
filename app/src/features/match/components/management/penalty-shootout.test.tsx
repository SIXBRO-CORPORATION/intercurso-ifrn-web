import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { PenaltyKicks } from "./penalty-kicks"
import { PenaltyShootout } from "./penalty-shootout"

const kick = vi.hoisted(() => ({ mutate: vi.fn(), isPending: false, isError: false, error: null as unknown }))

vi.mock("../../hooks/use-penalty-kick", () => ({ usePenaltyKick: () => kick }))

beforeEach(() => {
  kick.mutate.mockReset()
  kick.isPending = false
  kick.isError = false
  kick.error = null
})

const timeline = [
  { event_id: "e1", event_type: "PENALTY_GOAL", clock_seconds: 0, team_id: "t1", player_id: null },
  { event_id: "e2", event_type: "PENALTY_MISS", clock_seconds: 0, team_id: "t2", player_id: null },
  { event_id: "e3", event_type: "PENALTY_GOAL", clock_seconds: 0, team_id: "t1", player_id: null },
]

const match = () =>
  makeMatch({ score: [2, 2], setsWon: null, category: "KNOCKOUT", penalty: [2, 0], shootoutActive: true, timeline })

describe("PenaltyShootout", () => {
  it("mostra o placar oficial separado do placar dos pênaltis", () => {
    render(<PenaltyShootout match={match()} />)

    expect(screen.getByText("Placar oficial 2 × 2")).toBeTruthy()
    expect(screen.getByText("2 – 0")).toBeTruthy()
  })

  it("registra gol e perdeu de cada time", async () => {
    const user = userEvent.setup()
    render(<PenaltyShootout match={match()} />)

    await user.click(screen.getByRole("button", { name: "Gol de Falcões" }))
    await user.click(screen.getByRole("button", { name: "Perdeu Tigres" }))

    expect(kick.mutate).toHaveBeenNthCalledWith(1, { team_id: "t1", result: "GOAL" })
    expect(kick.mutate).toHaveBeenNthCalledWith(2, { team_id: "t2", result: "MISS" })
  })

  it("bloqueia os botões enquanto registra e mostra o erro do backend", () => {
    kick.isPending = true
    kick.isError = true
    kick.error = new Error("falhou")
    render(<PenaltyShootout match={match()} />)

    expect((screen.getByRole("button", { name: "Gol de Falcões" }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole("alert").textContent).toBe("Não foi possível executar a ação. Tente novamente.")
  })
})

describe("PenaltyKicks", () => {
  it("lista as cobranças na ordem com a numeração por time", () => {
    render(<PenaltyKicks match={match()} />)

    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(3)
    expect(items[0].textContent).toContain("Falcões")
    expect(items[0].textContent).toContain("1ª cobrança")
    expect(items[1].textContent).toContain("Perdido")
    expect(items[2].textContent).toContain("2ª cobrança")
  })

  it("avisa quando ainda não há cobranças", () => {
    render(<PenaltyKicks match={makeMatch({ penalty: [0, 0], shootoutActive: true })} />)

    expect(screen.getByText("Nenhuma cobrança ainda.")).toBeTruthy()
  })
})
