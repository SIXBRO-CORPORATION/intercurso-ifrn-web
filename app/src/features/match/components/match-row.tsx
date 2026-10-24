import Link from "next/link"
import { cn } from "@/lib/utils"
import { LiveDot } from "@/shared/components/live-dot"
import { Avatar, type avatarVariants } from "@/shared/components/ui/avatar"
import type { VariantProps } from "class-variance-authority"
import type { Match, MatchTeam } from "../types/match"
import { formatKickoff, isVolleyMatch, phaseLabel, scoreOf } from "../utils/match-card"

type Tone = NonNullable<VariantProps<typeof avatarVariants>["tone"]>

function StatusCell({ match }: { match: Match }) {
  if (match.status === "IN_PROGRESS") {
    const label = isVolleyMatch(match) ? "Ao vivo" : `${Math.floor((match.clock_seconds ?? 0) / 60)}'`
    return (
      <span className="flex flex-col items-center gap-1 text-primary-dark">
        <LiveDot className="text-primary" />
        <span className="type-caption font-bold tabular-nums">{label}</span>
      </span>
    )
  }
  if (match.status === "FINISHED") return <span className="type-caption font-bold text-muted-foreground">Fim</span>
  const kickoff = formatKickoff(match.scheduled_date)
  if (!kickoff) return <span className="type-caption text-muted-foreground">A definir</span>
  return (
    <span className="flex flex-col items-center">
      <span className="type-label font-bold text-ink tabular-nums">{kickoff.time ?? kickoff.date}</span>
      {kickoff.time && <span className="type-caption text-muted-foreground tabular-nums">{kickoff.date}</span>}
    </span>
  )
}

function TeamLine({ team, tone, winner }: { team: MatchTeam | null; tone: Tone; winner: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={team?.name} tone={tone} size="sm" />
      <span className={cn("truncate text-sm", winner ? "font-bold text-ink" : "font-medium", team ? "text-ink" : "text-muted-foreground")}>
        {team?.name ?? "A definir"}
      </span>
      {winner && <span className="sr-only">Vencedor</span>}
    </span>
  )
}

export function MatchRow({ match }: { match: Match }) {
  const live = match.status === "IN_PROGRESS"
  const phase = phaseLabel(match)
  const win1 = !!match.team1 && match.winner_id === match.team1.team_id
  const win2 = !!match.team2 && match.winner_id === match.team2.team_id
  const score = (team: MatchTeam | null, winner: boolean) => (
    <span className={cn("text-base tabular-nums", live ? "font-bold text-primary-dark" : winner ? "font-bold text-ink" : "font-medium text-ink")}>
      {scoreOf(match, team)}
    </span>
  )

  return (
    <li>
      <Link
        href={`/partidas/${match.match_id}`}
        className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 px-3 py-3 outline-none transition hover:bg-field focus-visible:bg-field focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-4"
      >
        <span className="grid place-items-center border-r border-border pr-3 text-center">
          <StatusCell match={match} />
        </span>
        <span className="flex min-w-0 flex-col gap-2">
          <TeamLine team={match.team1} tone="success" winner={win1} />
          <TeamLine team={match.team2} tone="dark" winner={win2} />
          {phase && <span className="type-caption truncate text-muted-foreground">{phase}</span>}
        </span>
        <span className="flex flex-col items-end gap-2 self-start py-1.5 text-right">
          {score(match.team1, win1)}
          {score(match.team2, win2)}
        </span>
      </Link>
    </li>
  )
}
