import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Match, MatchTeam } from "../types/match"
import { formatScheduledDate, phaseLabel } from "../utils/match-card"

type TeamRowProps = { team: MatchTeam | null; score: string | number; winner: boolean }

function TeamRow({ team, score, winner }: TeamRowProps) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className={cn("flex min-w-0 items-center gap-1.5 text-sm", team ? "text-brand-900" : "text-muted-foreground", winner && "font-semibold")}>
        <span className="truncate">{team?.name ?? "A definir"}</span>
        {winner && (
          <>
            <Trophy className="size-4 shrink-0 text-brand-600" aria-hidden />
            <span className="sr-only">Vencedor</span>
          </>
        )}
      </span>
      <span className="text-lg font-semibold tabular-nums text-brand-900">{score}</span>
    </li>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const phase = phaseLabel(match)
  const date = formatScheduledDate(match.scheduled_date)
  const played = match.status !== "SCHEDULED"
  const row = (team: MatchTeam | null) => (
    <TeamRow
      team={team}
      score={team && played ? team.score : "–"}
      winner={!!team && match.winner_id === team.team_id}
    />
  )

  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-brand-900">{match.modality_name}</h3>
          {phase && <p className="text-xs text-brand-700">{phase}</p>}
        </div>
        {match.clock_running && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
            <span className="size-1.5 rounded-full bg-destructive motion-safe:animate-pulse" aria-hidden />
            AO VIVO
          </span>
        )}
      </header>
      <ul className="space-y-2">
        {row(match.team1)}
        {row(match.team2)}
      </ul>
      <p className="text-xs text-muted-foreground">
        {date ? <time dateTime={match.scheduled_date ?? undefined}>{date}</time> : "Data a definir"}
      </p>
    </article>
  )
}
