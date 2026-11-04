"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail, MatchTeam } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { matchWinner, setSuggestion } from "../../utils/match-sets"

type ResultProps = { team1: MatchTeam; team2: MatchTeam; score1: number; score2: number; winner: MatchTeam; label: string }

function ResultBox({ team1, team2, score1, score2, winner, label }: ResultProps) {
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
      <Badge variant="success">
        {label}: {winner.name}
      </Badge>
    </div>
  )
}

export function SetPrompt({ match }: { match: MatchDetail }) {
  const end = useMatchAction(match.match_id)
  const [dismissedSet, setDismissedSet] = useState<string | null>(null)
  const [dismissedMatch, setDismissedMatch] = useState<string | null>(null)
  const { team1, team2 } = match
  if (!team1 || !team2) return null

  const result = matchWinner(match)
  if (result) {
    if (dismissedMatch === result.winner.team_id) return null
    return (
      <Dialog open onOpenChange={(open) => !open && setDismissedMatch(result.winner.team_id)}>
        <DialogContent>
          <DialogTitle>Finalizar partida?</DialogTitle>
          <DialogDescription>Um time atingiu os sets necessários. Confira o resultado ou continue a partida.</DialogDescription>
          <ResultBox
            team1={team1}
            team2={team2}
            score1={team1.sets_won ?? 0}
            score2={team2.sets_won ?? 0}
            winner={result.winner}
            label="Vencedor"
          />
          <DialogFooter>
            <Button variant="neutral" onClick={() => setDismissedMatch(result.winner.team_id)}>
              Continuar partida
            </Button>
            <Button disabled>
              <Check aria-hidden /> Finalizar partida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const suggestion = setSuggestion(match)
  if (!suggestion) return null
  const key = `${suggestion.number}:${team1.score}-${team2.score}`
  if (dismissedSet === key) return null

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !end.isPending) setDismissedSet(key)
      }}
    >
      <DialogContent>
        <DialogTitle>Encerrar set {suggestion.number}?</DialogTitle>
        <DialogDescription>Confira o placar do set antes de confirmar.</DialogDescription>
        <ResultBox
          team1={team1}
          team2={team2}
          score1={team1.score}
          score2={team2.score}
          winner={suggestion.winner}
          label="Vencedor do set"
        />
        {end.isError && (
          <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
            {parseMatchActionError(end.error)}
          </div>
        )}
        <DialogFooter>
          <Button variant="neutral" disabled={end.isPending} onClick={() => setDismissedSet(key)}>
            Voltar ao jogo
          </Button>
          <Button disabled={end.isPending} onClick={() => end.mutate("set/end")}>
            <Check aria-hidden /> {end.isPending ? "Encerrando…" : "Encerrar set"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
