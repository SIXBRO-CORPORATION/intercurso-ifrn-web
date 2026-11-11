import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { FinishMatch } from "./finish-match"

const action = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  isPending: false,
  isError: false,
  error: null as unknown,
}))

vi.mock("../../hooks/use-match-action", () => ({ useMatchAction: () => action }))

beforeEach(() => {
  action.mutate.mockReset()
  action.reset.mockReset()
  action.isPending = false
  action.isError = false
  action.error = null
})

const header = () => screen.getByRole("button", { name: "Finalizar partida" }) as HTMLButtonElement
const won = () => makeMatch({ score: [2, 1], setsWon: null })

describe("FinishMatch: com vencedor", () => {
  it("pede confirmação mostrando o placar e o vencedor, sem finalizar ainda", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={won()} />)

    await user.click(header())

    const dialog = screen.getByRole("dialog", { name: "Finalizar partida?" })
    expect(within(dialog).getByText("2 × 1")).toBeTruthy()
    expect(within(dialog).getByText("Vencedor: Falcões")).toBeTruthy()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("só chama finish ao confirmar no diálogo", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={won()} />)

    await user.click(header())
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Finalizar partida" }))

    expect(action.mutate).toHaveBeenCalledTimes(1)
    expect(action.mutate).toHaveBeenCalledWith("finish")
  })

  it("Voltar ao jogo fecha o diálogo sem finalizar", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={won()} />)

    await user.click(header())
    await user.click(screen.getByRole("button", { name: "Voltar ao jogo" }))

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("Esc fecha o diálogo sem finalizar", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={won()} />)

    await user.click(header())
    await user.keyboard("{Escape}")

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("mostra o vencedor do segundo time", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={makeMatch({ score: [0, 1], setsWon: null })} />)

    await user.click(header())

    expect(screen.getByText("Vencedor: Tigres")).toBeTruthy()
  })

  it("bloqueia os botões e mostra o progresso enquanto finaliza", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FinishMatch match={won()} />)
    await user.click(header())

    action.isPending = true
    rerender(<FinishMatch match={won()} />)

    const dialog = screen.getByRole("dialog")
    expect((within(dialog).getByRole("button", { name: "Finalizando…" }) as HTMLButtonElement).disabled).toBe(true)
    expect((within(dialog).getByRole("button", { name: "Voltar ao jogo" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("mostra o erro do backend dentro do diálogo e o mantém aberto", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FinishMatch match={won()} />)
    await user.click(header())

    action.isError = true
    action.error = new Error("falhou")
    rerender(<FinishMatch match={won()} />)

    const dialog = screen.getByRole("dialog", { name: "Finalizar partida?" })
    expect(within(dialog).getByRole("alert").textContent).toBe("Não foi possível executar a ação. Tente novamente.")
  })
})

describe("FinishMatch: empate", () => {
  const tied = () => makeMatch({ score: [1, 1], setsWon: null })

  it("abre o diálogo mostrando o empate, sem finalizar ainda", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())

    const dialog = screen.getByRole("dialog", { name: "Finalizar partida?" })
    expect(within(dialog).getByText("1 × 1")).toBeTruthy()
    expect(within(dialog).getByText("Empate")).toBeTruthy()
    expect(within(dialog).queryByText(/Vencedor/)).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("só chama finish ao confirmar o empate", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Finalizar partida" }))

    expect(action.mutate).toHaveBeenCalledTimes(1)
    expect(action.mutate).toHaveBeenCalledWith("finish")
  })

  it("Voltar ao jogo fecha o diálogo sem finalizar", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())
    await user.click(screen.getByRole("button", { name: "Voltar ao jogo" }))

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })
})

describe("FinishMatch: vôlei", () => {
  it("confirma pelo resultado em sets, não pelo placar do set", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={makeMatch({ score: [0, 0], setsWon: [3, 1] })} />)

    await user.click(header())

    const dialog = screen.getByRole("dialog", { name: "Finalizar partida?" })
    expect(within(dialog).getByText("3 × 1")).toBeTruthy()
    expect(within(dialog).getByText("Vencedor: Falcões")).toBeTruthy()
  })

  it("não permite finalizar com sets empatados", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={makeMatch({ setsWon: [1, 1] })} />)

    expect(header().disabled).toBe(true)
    await user.click(header())
    expect(action.mutate).not.toHaveBeenCalled()
  })
})

describe("FinishMatch: empate em mata-mata", () => {
  const tied = () => makeMatch({ score: [2, 2], setsWon: null, category: "KNOCKOUT" })

  it("pergunta se deve iniciar a disputa de pênaltis, sem finalizar", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())

    const dialog = screen.getByRole("dialog", { name: "Partida empatada" })
    expect(within(dialog).getByText("A partida terminou empatada. Iniciar disputa de pênaltis?")).toBeTruthy()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("inicia a disputa ao confirmar", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())
    await user.click(screen.getByRole("button", { name: "Iniciar pênaltis" }))

    expect(action.mutate).toHaveBeenCalledWith("penalty-shootout/start", expect.any(Object))
  })

  it("cancelar mantém a partida em andamento", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={tied()} />)

    await user.click(header())
    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })
})

describe("FinishMatch: empate na fase de grupos", () => {
  it("finaliza direto, sem popup", async () => {
    const user = userEvent.setup()
    render(<FinishMatch match={makeMatch({ score: [1, 1], setsWon: null, category: "GROUP" })} />)

    await user.click(header())

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).toHaveBeenCalledWith("finish", expect.any(Object))
  })
})
