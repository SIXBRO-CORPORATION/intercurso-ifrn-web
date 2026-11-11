"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { usePenaltyKick } from "../../hooks/use-penalty-kick"
import type { MatchDetail, MatchTeam, PenaltyKickResult } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { kickResults, MIN_KICK_SLOTS, penaltyKicks } from "../../utils/match-penalties"

function KickDots({ team, results }: { team: MatchTeam; results: boolean[] }) {
  const slots = Math.max(MIN_KICK_SLOTS, results.length)
  const scored = results.filter(Boolean).length
  return (
    <div
      role="img"
      aria-label={`${team.name}: ${scored} convertidas e ${results.length - scored} perdidas`}
      className="flex flex-wrap justify-center gap-2"
    >
      {Array.from({ length: slots }, (_, i) => (
        <span
          key={i}
          className={cn("size-3 rounded-full", results[i] === undefined ? "bg-white/20" : results[i] ? "bg-primary" : "bg-danger")}
        />
      ))}
    </div>
  )
}

export function PenaltyShootout({ match }: { match: MatchDetail }) {
  const kick = usePenaltyKick(match.match_id)
  const { team1, team2 } = match
  if (!team1 || !team2) return null

  const kicks = penaltyKicks(match)
  const send = (team: MatchTeam, result: PenaltyKickResult) => kick.mutate({ team_id: team.team_id, result })

  return (
    <div className="space-y-4">
      <section aria-label="Disputa de pênaltis" className="space-y-5 rounded-xl bg-ink p-5 text-white shadow-lg">
        <header className="space-y-1 text-center">
          <p className="type-overline text-white/80">Disputa de pênaltis</p>
          <p className="type-label text-white/70">
            Placar oficial {team1.score} × {team2.score}
          </p>
        </header>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
          <p className="type-body-lg wrap-break-word font-bold">{team1.name}</p>
          <p className="type-score tabular-nums">
            <span className="sr-only">Placar dos pênaltis </span>
            {team1.penalty_score ?? 0} – {team2.penalty_score ?? 0}
          </p>
          <p className="type-body-lg wrap-break-word font-bold">{team2.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <KickDots team={team1} results={kickResults(kicks, team1.team_id)} />
          <KickDots team={team2} results={kickResults(kicks, team2.team_id)} />
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3">
        {[team1, team2].map((team) => (
          <div key={team.team_id} className="grid gap-2">
            <Button size="lg" disabled={kick.isPending} aria-label={`Gol de ${team.name}`} onClick={() => send(team, "GOAL")}>
              <Check aria-hidden /> Gol
            </Button>
            <Button
              variant="danger-soft"
              size="lg"
              disabled={kick.isPending}
              aria-label={`Perdeu ${team.name}`}
              onClick={() => send(team, "MISS")}
            >
              <X aria-hidden /> Perdeu
            </Button>
          </div>
        ))}
      </div>
      {kick.isError && (
        <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
          {parseMatchActionError(kick.error)}
        </div>
      )}
    </div>
  )
}
