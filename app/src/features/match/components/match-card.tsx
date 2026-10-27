"use client"

import { Trophy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LiveDot } from "@/shared/components/live-dot"
import { Avatar, type avatarVariants } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import type { VariantProps } from "class-variance-authority"
import { STATUS_OPTIONS } from "../constants"
import { usePrefetchMatch } from "../hooks/use-prefetch-match"
import type { Match, MatchTeam } from "../types/match"
import { formatScheduledDate, periodLabel, phaseLabel } from "../utils/match-card"

type Tone = NonNullable<VariantProps<typeof avatarVariants>["tone"]>
type TeamRowProps = { team: MatchTeam | null; score: string | number; winner: boolean; tone: Tone }

function TeamRow({ team, score, winner, tone }: TeamRowProps) {
  const weight = winner ? "font-bold" : "font-medium"
  return (
    <li className="flex items-center gap-3">
      <Avatar name={team?.name} tone={tone} size="sm" />
      <span className={cn("flex min-w-0 flex-1 items-center gap-1.5 text-sm", weight, team ? "text-ink" : "text-muted-foreground")}>
        <span className="truncate">{team?.name ?? "A definir"}</span>
        {winner && (
          <>
            <Trophy className="size-4 shrink-0 text-primary-dark" aria-hidden />
            <span className="sr-only">Vencedor</span>
          </>
        )}
      </span>
      <span className={cn("text-lg tabular-nums text-ink", weight)}>{score}</span>
    </li>
  )
}

function LiveTeam({ team }: { team: MatchTeam | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Avatar name={team?.name} tone="inverse" size="lg" />
      <span className="w-full truncate text-sm font-bold">{team?.name ?? "A definir"}</span>
    </div>
  )
}

function LiveCard({ match }: { match: Match }) {
  const phase = phaseLabel(match)
  const period = periodLabel(match.current_period)
  const score = (team: MatchTeam | null) => (team ? team.score : "–")
  return (
    <article className="flex h-full flex-col gap-4 rounded-xl bg-linear-to-b from-primary to-primary-dark p-5 text-white shadow-primary">
      <header className="flex items-center justify-between gap-3">
        <span className="type-overline inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5">
          {match.clock_running && <LiveDot />}
          {match.clock_running ? "Ao vivo" : "Em andamento"}
        </span>
        {period && <span className="type-caption text-white/80">{period}</span>}
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <LiveTeam team={match.team1} />
        <p className="type-score">
          <span className="sr-only">Placar </span>
          {score(match.team1)} – {score(match.team2)}
        </p>
        <LiveTeam team={match.team2} />
      </div>
      <footer className="mt-auto space-y-0.5 text-center">
        <p className="truncate text-sm font-bold">{match.modality_name}</p>
        {phase && <p className="type-caption text-white/80">{phase}</p>}
      </footer>
    </article>
  )
}

function ListCard({ match }: { match: Match }) {
  const phase = phaseLabel(match)
  const date = formatScheduledDate(match.scheduled_date)
  const played = match.status !== "SCHEDULED"
  const status = STATUS_OPTIONS.find((o) => o.value === match.status)?.label
  const row = (team: MatchTeam | null, tone: Tone) => (
    <TeamRow team={team} tone={tone} score={team && played ? team.score : "–"} winner={!!team && match.winner_id === team.team_id} />
  )

  return (
    <Card asChild className="flex h-full flex-col gap-4 p-5">
      <article>
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="type-section truncate text-ink">{match.modality_name}</h3>
            {phase && <p className="type-caption text-primary-dark">{phase}</p>}
          </div>
          {status && <Badge>{status}</Badge>}
        </header>
        <ul className="space-y-3">
          {row(match.team1, "success")}
          {row(match.team2, "danger")}
        </ul>
        <p className="type-caption mt-auto text-muted-foreground">
          {date ? <time dateTime={match.scheduled_date ?? undefined}>{date}</time> : "Data a definir"}
        </p>
      </article>
    </Card>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const prefetch = usePrefetchMatch()
  const warm = () => prefetch(match.match_id)
  return (
    <Link
      href={`/partidas/${match.match_id}`}
      onPointerEnter={warm}
      onFocus={warm}
      className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {match.status === "IN_PROGRESS" ? <LiveCard match={match} /> : <ListCard match={match} />}
    </Link>
  )
}
