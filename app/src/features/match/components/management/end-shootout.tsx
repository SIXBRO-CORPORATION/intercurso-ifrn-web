"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { penaltyWinner } from "../../utils/match-penalties"
import { ResultDialog } from "./result-dialog"

export function EndShootout({ match }: { match: MatchDetail }) {
  const action = useMatchAction(match.match_id)
  const [open, setOpen] = useState(false)
  const { team1, team2 } = match
  const winner = penaltyWinner(match)
  const error = action.isError ? parseMatchActionError(action.error) : null

  const close = () => {
    action.reset()
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="dark"
        disabled={!winner}
        title={winner ? undefined : "A disputa precisa ter um vencedor para ser encerrada"}
        onClick={() => {
          action.reset()
          setOpen(true)
        }}
      >
        <Flag aria-hidden /> Encerrar pênaltis
      </Button>
      {open && team1 && team2 && (
        <ResultDialog
          title="Encerrar pênaltis?"
          description="Confira o resultado da disputa antes de confirmar."
          result={{
            team1,
            team2,
            score1: team1.score,
            score2: team2.score,
            winner,
            label: "Vencedor nos pênaltis",
            penalties: [team1.penalty_score ?? 0, team2.penalty_score ?? 0],
          }}
          error={error}
          pending={action.isPending}
          cancelLabel="Voltar à disputa"
          confirmLabel="Encerrar pênaltis"
          pendingLabel="Encerrando…"
          onCancel={close}
          onConfirm={() => action.mutate("penalty-shootout/end")}
        />
      )}
    </>
  )
}
