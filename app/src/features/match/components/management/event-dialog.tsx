"use client"

import { useState } from "react"
import { CircleDot, Plus, Square } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useRegisterEvent } from "../../hooks/use-register-event"
import type { MatchDetail, MatchEventKind, MatchPlayer, MatchTeam } from "../../types/match"
import { isVolleyMatch, matchClockLimit, scoreActionLabel } from "../../utils/match-card"
import { parseRegisterEventError } from "../../utils/register-event-error"
import { LiveClock } from "../live-clock"

type Props = {
  match: MatchDetail
  team: MatchTeam
  player: MatchPlayer
  yellows: number
  onClose: () => void
}

export function EventDialog({ match, team, player, yellows, onClose }: Props) {
  const register = useRegisterEvent(match.match_id)
  const [confirmingExpulsion, setConfirmingExpulsion] = useState(false)
  const scoreLabel = scoreActionLabel(match)
  const ScoreIcon = scoreLabel === "Gol" ? CircleDot : Plus

  const submit = (kind: MatchEventKind) =>
    register.mutate({ kind, team_id: team.team_id, player_id: player.user_id }, { onSuccess: onClose })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !register.isPending) onClose()
      }}
    >
      <DialogContent>
        <DialogTitle>{player.name}</DialogTitle>
        <DialogDescription>
          {team.name}
          {!isVolleyMatch(match) && (
            <>
              {" · registrando aos "}
              <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={matchClockLimit(match)} />
            </>
          )}
        </DialogDescription>

        {register.isError && (
          <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
            {parseRegisterEventError(register.error)}
          </div>
        )}

        {confirmingExpulsion ? (
          <>
            <Alert variant="destructive">
              <AlertTitle>Isso resultará em expulsão</AlertTitle>
              <AlertDescription>
                {player.name} já possui 1 cartão amarelo nesta partida. O segundo amarelo expulsa o jogador automaticamente. Confirmar?
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="neutral" disabled={register.isPending} onClick={() => setConfirmingExpulsion(false)}>
                Voltar
              </Button>
              <Button variant="danger" disabled={register.isPending} onClick={() => submit("YELLOW")}>
                {register.isPending ? "Registrando…" : "Confirmar expulsão"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="grid gap-3">
            <Button size="lg" disabled={register.isPending} onClick={() => submit("GOAL")}>
              <ScoreIcon aria-hidden /> {scoreLabel}
            </Button>
            <Button
              variant="warning"
              size="lg"
              disabled={register.isPending}
              onClick={() => (yellows > 0 ? setConfirmingExpulsion(true) : submit("YELLOW"))}
            >
              <Square className="fill-current" aria-hidden /> Cartão amarelo
            </Button>
            <Button variant="danger" size="lg" disabled={register.isPending} onClick={() => submit("RED")}>
              <Square className="fill-current" aria-hidden /> Cartão vermelho
            </Button>
            <p className="type-caption text-center text-faint">Esc para cancelar</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
