"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { matchWinner, setSuggestion } from "../../utils/match-sets"
import { ResultBox } from "./result-dialog"

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
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open && !end.isPending) setDismissedMatch(result.winner.team_id)
        }}
      >
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
          {end.isError && (
            <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
              {parseMatchActionError(end.error)}
            </div>
          )}
          <DialogFooter>
            <Button variant="neutral" disabled={end.isPending} onClick={() => setDismissedMatch(result.winner.team_id)}>
              Continuar partida
            </Button>
            <Button disabled={end.isPending} onClick={() => end.mutate("finish")}>
              <Check aria-hidden /> {end.isPending ? "Finalizando…" : "Finalizar partida"}
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
