import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { EndShootout } from "./end-shootout"

const action = vi.hoisted(() => ({ mutate: vi.fn(), reset: vi.fn(), isPending: false, isError: false, error: null as unknown }))

vi.mock("../../hooks/use-match-action", () => ({ useMatchAction: () => action }))

beforeEach(() => {
  action.mutate.mockReset()
  action.reset.mockReset()
  action.isPending = false
  action.isError = false
  action.error = null
})

const shootout = (penalty: [number, number]) =>
  makeMatch({ score: [2, 2], setsWon: null, category: "KNOCKOUT", penalty, shootoutActive: true })

describe("EndShootout", () => {
  it("fica desabilitado enquanto os pênaltis estão empatados", () => {
    render(<EndShootout match={shootout([4, 4])} />)

    expect((screen.getByRole("button", { name: "Encerrar pênaltis" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("mostra o resultado no formato X(p) × Y(p) e encerra ao confirmar", async () => {
    const user = userEvent.setup()
    render(<EndShootout match={shootout([5, 4])} />)

    await user.click(screen.getByRole("button", { name: "Encerrar pênaltis" }))

    const dialog = screen.getByRole("dialog", { name: "Encerrar pênaltis?" })
    expect(within(dialog).getByText("2(5) × 2(4)")).toBeTruthy()
    expect(within(dialog).getByText("Vencedor nos pênaltis: Falcões")).toBeTruthy()

    await user.click(within(dialog).getByRole("button", { name: "Encerrar pênaltis" }))
    expect(action.mutate).toHaveBeenCalledWith("penalty-shootout/end")
  })
})
