"use client"

import { useState } from "react"
import { CircleDot, Plus } from "lucide-react"
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

type Expulsion = "YELLOW" | "RED"

const WARNINGS: Record<Expulsion, (name: string) => { title: string; text: string }> = {
  YELLOW: (name) => ({
    title: "Isso resultará em expulsão",
    text: `${name} já possui 1 cartão amarelo nesta partida. O segundo amarelo expulsa o jogador automaticamente. Confirmar?`,
  }),
  RED: (name) => ({
    title: "Cartão vermelho expulsa o jogador",
    text: `${name} será expulso imediatamente e não poderá mais marcar nesta partida. Confirmar?`,
  }),
}

export function EventDialog({ match, team, player, yellows, onClose }: Props) {
  const register = useRegisterEvent(match.match_id)
  const [confirming, setConfirming] = useState<Expulsion | null>(null)
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
          <div role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-danger-text">
            {parseRegisterEventError(register.error)}
          </div>
        )}

        {confirming ? (
          <>
            <Alert variant="destructive">
              <AlertTitle>{WARNINGS[confirming](player.name).title}</AlertTitle>
              <AlertDescription>{WARNINGS[confirming](player.name).text}</AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="secondary" disabled={register.isPending} onClick={() => setConfirming(null)}>
                Voltar
              </Button>
              <Button variant="danger" disabled={register.isPending} onClick={() => submit(confirming)}>
                {register.isPending ? "Registrando…" : "Confirmar expulsão"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="grid gap-2">
            <Button size="lg" disabled={register.isPending} onClick={() => submit("GOAL")}>
              <ScoreIcon aria-hidden /> {scoreLabel}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              disabled={register.isPending}
              onClick={() => (yellows > 0 ? setConfirming("YELLOW") : submit("YELLOW"))}
            >
              <span className="h-3.5 w-2.5 rounded-[2px] bg-card-yellow" aria-hidden /> Cartão amarelo
            </Button>
            <Button variant="secondary" size="lg" disabled={register.isPending} onClick={() => setConfirming("RED")}>
              <span className="h-3.5 w-2.5 rounded-[2px] bg-card-red" aria-hidden /> Cartão vermelho
            </Button>
            <p className="type-small text-center text-muted-foreground">Esc para cancelar</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
