"use client"

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useCorrectEvent } from "../../hooks/use-correct-event"
import type { MatchDetail } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { lastCorrectableEvent, rowSummary, timelineRows } from "../../utils/match-timeline"

type Props = { match: MatchDetail; eventId: string | null; onClose: () => void }

export function CorrectEventDialog({ match, eventId, onClose }: Props) {
  const correct = useCorrectEvent(match.match_id)
  const undo = eventId === null
  const targetId = eventId ?? lastCorrectableEvent(match.timeline)?.event_id
  const row = timelineRows(match).find((r) => r.id === targetId)
  const result = correct.isSuccess ? correct.data : null
  const alert = result?.correction_alert
  const reactivated = result && [...result.team1_players, ...result.team2_players].find((p) => p.user_id === result.reactivated_player_id)
  const done = correct.isSuccess

  const confirm = () =>
    correct.mutate(eventId, {
      onSuccess: (updated) => {
        if (!updated.correction_alert && !updated.reactivated_player_id) onClose()
      },
    })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !correct.isPending) onClose()
      }}
    >
      <DialogContent>
        <DialogTitle>{done ? "Correção aplicada" : undo ? "Desfazer último evento?" : "Excluir evento?"}</DialogTitle>
        {!done && (
          <DialogDescription>
            {row ? rowSummary(row) : "O evento selecionado"}
            {row?.team && ` (${row.team})`}. O placar e a linha do tempo serão recalculados.
          </DialogDescription>
        )}

        {correct.isError && (
          <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
            {parseMatchActionError(correct.error)}
          </div>
        )}

        {reactivated && (
          <Alert variant="success">
            <AlertTitle>Jogador reativado</AlertTitle>
            <AlertDescription>{reactivated.name} voltou ao jogo e já pode ser selecionado.</AlertDescription>
          </Alert>
        )}

        {alert && (
          <Alert variant="destructive">
            <AlertTitle>Placar alterado em partida finalizada</AlertTitle>
            <AlertDescription>
              <p>
                {alert.previous_score} → {alert.corrected_score}
                {alert.current_status && ` · ${alert.current_status}`}
              </p>
              {alert.required_actions?.length ? (
                <ul className="list-disc pl-4">
                  {alert.required_actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              ) : null}
              {alert.note && <p>{alert.note}</p>}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          {done ? (
            <Button onClick={onClose}>Fechar</Button>
          ) : (
            <>
              <Button variant="neutral" disabled={correct.isPending} onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="danger" disabled={correct.isPending} onClick={confirm}>
                {correct.isPending ? "Corrigindo…" : undo ? "Desfazer" : "Excluir evento"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
