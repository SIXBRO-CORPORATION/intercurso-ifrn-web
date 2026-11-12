import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeMatch } from "@/tests/match-fixtures"
import { CorrectEventDialog } from "./correct-event-dialog"

const correct = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null as unknown,
  data: undefined as unknown,
}))

vi.mock("../../hooks/use-correct-event", () => ({ useCorrectEvent: () => correct }))

beforeEach(() => {
  correct.mutate.mockReset()
  correct.isPending = false
  correct.isError = false
  correct.isSuccess = false
  correct.error = null
  correct.data = undefined
})

const match = makeMatch({
  setsWon: null,
  timeline: [
    { event_id: "e1", event_type: "GOAL", clock_seconds: 125, team_id: "t1", player_id: "p1", created_at: "2026-11-12T19:00:00Z" },
    { event_id: "e2", event_type: "CARD_YELLOW", clock_seconds: 300, team_id: "t2", player_id: "p2", created_at: "2026-11-12T19:05:00Z" },
  ],
})
match.team1_players = [{ user_id: "p1", name: "Lucas" }]
match.team2_players = [{ user_id: "p2", name: "Davi" }]

describe("CorrectEventDialog", () => {
  it("desfazer descreve o último evento e confirma sem id", async () => {
    render(<CorrectEventDialog match={match} eventId={null} onClose={vi.fn()} />)

    expect(screen.getByRole("dialog", { name: "Desfazer último evento?" })).toBeTruthy()
    expect(screen.getByText(/Cartão amarelo · Davi · 05:00 \(Tigres\)/)).toBeTruthy()

    await userEvent.click(screen.getByRole("button", { name: "Desfazer" }))
    expect(correct.mutate).toHaveBeenCalledWith(null, expect.any(Object))
  })

  it("excluir mostra os detalhes do evento escolhido e confirma com o id; cancelar não corrige", async () => {
    const onClose = vi.fn()
    render(<CorrectEventDialog match={match} eventId="e1" onClose={onClose} />)

    expect(screen.getByText(/Gol · Lucas · 02:05 \(Falcões\)/)).toBeTruthy()

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onClose).toHaveBeenCalled()
    expect(correct.mutate).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole("button", { name: "Excluir evento" }))
    expect(correct.mutate).toHaveBeenCalledWith("e1", expect.any(Object))
  })

  it("mostra a mensagem do backend quando o evento não pode ser corrigido", () => {
    correct.isError = true
    correct.error = Object.assign(new Error("x"), {
      isAxiosError: true,
      response: { status: 400, data: { error: "Este tipo de evento não pode ser desfeito/deletado (PERIOD_END)" } },
    })
    render(<CorrectEventDialog match={match} eventId="e1" onClose={vi.fn()} />)

    expect(screen.getByRole("alert").textContent).toContain("não pode ser desfeito")
  })

  it("após corrigir mostra jogador reativado e alerta de chaveamento", () => {
    correct.isSuccess = true
    correct.data = {
      ...match,
      reactivated_player_id: "p1",
      correction_alert: { previous_score: "2x1", corrected_score: "1x1", current_status: "EMPATE", required_actions: ["Verificar o chaveamento"], note: "Auditado" },
    }
    render(<CorrectEventDialog match={match} eventId="e1" onClose={vi.fn()} />)

    expect(screen.getByText("Lucas voltou ao jogo e já pode ser selecionado.")).toBeTruthy()
    expect(screen.getByText("Placar alterado em partida finalizada")).toBeTruthy()
    expect(screen.getByText(/2x1 → 1x1 · EMPATE/)).toBeTruthy()
    expect(screen.getByText("Verificar o chaveamento")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Fechar" })).toBeTruthy()
  })
})
