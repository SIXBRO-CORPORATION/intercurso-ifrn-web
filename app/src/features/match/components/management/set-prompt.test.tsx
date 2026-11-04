import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { finishedSets, makeMatch } from "@/tests/match-fixtures"
import { SetPrompt } from "./set-prompt"

const action = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  error: null as unknown,
}))

vi.mock("../../hooks/use-match-action", () => ({ useMatchAction: () => action }))

beforeEach(() => {
  action.mutate.mockReset()
  action.isPending = false
  action.isError = false
  action.error = null
})

describe("SetPrompt: fim de set", () => {
  it("não abre sem diferença de 2 pontos nem antes da meta", () => {
    const { rerender } = render(<SetPrompt match={makeMatch({ score: [25, 24] })} />)
    expect(screen.queryByRole("dialog")).toBeNull()

    rerender(<SetPrompt match={makeMatch({ score: [24, 22] })} />)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("abre com o placar do set e o vencedor quando o set fecha", () => {
    render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)

    expect(screen.getByRole("dialog", { name: "Encerrar set 1?" })).toBeTruthy()
    expect(screen.getByText("25 × 23")).toBeTruthy()
    expect(screen.getByText("Vencedor do set: Falcões")).toBeTruthy()
  })

  it("usa a meta de 15 pontos no set decisivo", () => {
    const sets = finishedSets(4)
    const { rerender } = render(<SetPrompt match={makeMatch({ score: [15, 14], sets })} />)
    expect(screen.queryByRole("dialog")).toBeNull()

    rerender(<SetPrompt match={makeMatch({ score: [15, 13], sets })} />)
    expect(screen.getByRole("dialog", { name: "Encerrar set 5?" })).toBeTruthy()
  })

  it("exige confirmação: só chama set/end ao clicar em Encerrar set", async () => {
    const user = userEvent.setup()
    render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)
    expect(action.mutate).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: "Encerrar set" }))

    expect(action.mutate).toHaveBeenCalledTimes(1)
    expect(action.mutate).toHaveBeenCalledWith("set/end")
  })

  it("Voltar ao jogo fecha sem encerrar e só reabre quando o placar muda", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)

    await user.click(screen.getByRole("button", { name: "Voltar ao jogo" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()

    rerender(<SetPrompt match={makeMatch({ score: [25, 23] })} />)
    expect(screen.queryByRole("dialog")).toBeNull()

    rerender(<SetPrompt match={makeMatch({ score: [26, 23] })} />)
    expect(screen.getByRole("dialog", { name: "Encerrar set 1?" })).toBeTruthy()
  })

  it("Esc dispensa o diálogo sem encerrar o set", async () => {
    const user = userEvent.setup()
    render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)

    await user.keyboard("{Escape}")

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("bloqueia os botões e mostra o progresso enquanto encerra", () => {
    action.isPending = true
    render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)

    const confirm = screen.getByRole("button", { name: "Encerrando…" }) as HTMLButtonElement
    const back = screen.getByRole("button", { name: "Voltar ao jogo" }) as HTMLButtonElement
    expect(confirm.disabled).toBe(true)
    expect(back.disabled).toBe(true)
  })

  it("mostra a mensagem de erro e mantém o diálogo aberto", () => {
    action.isError = true
    action.error = new Error("falhou")
    render(<SetPrompt match={makeMatch({ score: [25, 23] })} />)

    expect(screen.getByRole("alert").textContent).toBe("Não foi possível executar a ação. Tente novamente.")
    expect(screen.getByRole("dialog", { name: "Encerrar set 1?" })).toBeTruthy()
  })
})

describe("SetPrompt: fim da partida", () => {
  const won = () => makeMatch({ setsWon: [3, 1], sets: finishedSets(4) })

  it("sugere finalizar quando um time atinge os sets necessários", () => {
    render(<SetPrompt match={won()} />)

    expect(screen.getByRole("dialog", { name: "Finalizar partida?" })).toBeTruthy()
    expect(screen.getByText("3 × 1")).toBeTruthy()
    expect(screen.getByText("Vencedor: Falcões")).toBeTruthy()
  })

  it("não sugere enquanto ninguém atingiu os sets necessários", () => {
    render(<SetPrompt match={makeMatch({ setsWon: [2, 1], sets: finishedSets(3) })} />)

    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("mantém Finalizar partida desabilitado enquanto não há endpoint", () => {
    render(<SetPrompt match={won()} />)

    const finish = screen.getByRole("button", { name: "Finalizar partida" }) as HTMLButtonElement
    expect(finish.disabled).toBe(true)
  })

  it("Continuar partida fecha o diálogo e não reabre", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SetPrompt match={won()} />)

    await user.click(screen.getByRole("button", { name: "Continuar partida" }))
    expect(screen.queryByRole("dialog")).toBeNull()

    rerender(<SetPrompt match={won()} />)
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(action.mutate).not.toHaveBeenCalled()
  })

  it("mostra o vencedor correto quando o segundo time vence", () => {
    render(<SetPrompt match={makeMatch({ setsWon: [1, 3], sets: finishedSets(4) })} />)

    expect(screen.getByText("Vencedor: Tigres")).toBeTruthy()
  })
})
