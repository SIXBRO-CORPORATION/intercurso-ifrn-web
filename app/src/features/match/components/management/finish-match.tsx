"use client"

import { useState } from "react"
import { Check, Flag } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail, MatchTeam } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { finishResult } from "../../utils/match-finish"

type ResultProps = { team1: MatchTeam; team2: MatchTeam; score1: number; score2: number; winner: MatchTeam | null; label: string }

export function ResultBox({ team1, team2, score1, score2, winner, label }: ResultProps) {
  return (
    <div className="space-y-2 rounded-xl bg-field p-5 text-center">
      <div className="grid grid-cols-2 gap-2">
        <p className="type-body-lg wrap-break-word font-bold text-ink">{team1.name}</p>
        <p className="type-body-lg wrap-break-word font-bold text-ink">{team2.name}</p>
      </div>
      <p className="type-large-title tabular-nums text-ink">
        <span className="sr-only">Placar </span>
        {score1} × {score2}
      </p>
      <Badge variant={winner ? "success" : "neutral"}>{winner ? `${label}: ${winner.name}` : "Empate"}</Badge>
    </div>
  )
}

export function FinishMatch({ match }: { match: MatchDetail }) {
  const finish = useMatchAction(match.match_id)
  const [open, setOpen] = useState(false)
  const result = finishResult(match)
  const blocked = !result || (result.sets && !result.winner)
  const error = finish.isError ? parseMatchActionError(finish.error) : null

  const close = () => {
    finish.reset()
    setOpen(false)
  }

  const start = () => {
    finish.reset()
    setOpen(true)
  }

  return (
    <>
      <Button variant="dark" disabled={blocked} onClick={start}>
        <Flag aria-hidden /> Finalizar partida
      </Button>
      {open && result && (
        <Dialog
          open
          onOpenChange={(next) => {
            if (!next && !finish.isPending) close()
          }}
        >
          <DialogContent>
            <DialogTitle>Finalizar partida?</DialogTitle>
            <DialogDescription>Confira o resultado antes de confirmar.</DialogDescription>
            <ResultBox
              team1={result.team1}
              team2={result.team2}
              score1={result.score1}
              score2={result.score2}
              winner={result.winner}
              label="Vencedor"
            />
            {error && (
              <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="neutral" disabled={finish.isPending} onClick={close}>
                Voltar ao jogo
              </Button>
              <Button disabled={finish.isPending} onClick={() => finish.mutate("finish")}>
                <Check aria-hidden /> {finish.isPending ? "Finalizando…" : "Finalizar partida"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
