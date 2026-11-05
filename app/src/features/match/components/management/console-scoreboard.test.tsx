import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { ConsoleScoreboard } from "./console-scoreboard"

vi.mock("../../hooks/use-match-action", () => ({
  useMatchAction: () => ({ mutate: vi.fn(), reset: vi.fn(), isPending: false, isError: false, error: null }),
}))

const noop = () => {}
const finished = (options: Parameters<typeof makeMatch>[0]) => makeMatch({ status: "FINISHED", ...options })

describe("ConsoleScoreboard: partida finalizada", () => {
  it("mostra o resultado e o vencedor", () => {
    render(<ConsoleScoreboard match={finished({ score: [2, 1], setsWon: null, winnerId: "t1" })} onPlay={noop} onEndPeriod={noop} />)

    expect(screen.getByText("Encerrada")).toBeTruthy()
    expect(screen.getByText("2 – 1")).toBeTruthy()
    expect(screen.getByText("Vencedor: Falcões")).toBeTruthy()
  })

  it("mostra empate quando não há vencedor", () => {
    render(<ConsoleScoreboard match={finished({ score: [1, 1], setsWon: null })} onPlay={noop} onEndPeriod={noop} />)

    expect(screen.getByText("Empate")).toBeTruthy()
  })

  it("mostra os sets no vôlei", () => {
    render(<ConsoleScoreboard match={finished({ score: [0, 0], setsWon: [3, 1], winnerId: "t1" })} onPlay={noop} onEndPeriod={noop} />)

    expect(screen.getByText("3 – 1")).toBeTruthy()
  })

  it("deixa de oferecer ações de registro", () => {
    render(<ConsoleScoreboard match={finished({ score: [2, 1], setsWon: null, winnerId: "t1" })} onPlay={noop} onEndPeriod={noop} />)

    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("ConsoleScoreboard: partida em andamento", () => {
  it("não mostra vencedor", () => {
    render(<ConsoleScoreboard match={makeMatch({ score: [2, 1], setsWon: null })} onPlay={noop} onEndPeriod={noop} />)

    expect(screen.queryByText(/Vencedor/)).toBeNull()
  })
})
