import Link from "next/link"
import { LiveDot } from "@/shared/components/live-dot"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { MANAGE_PATH } from "../constants"
import type { Match, MatchTeam } from "../types/match"
import { formatClock, formatScheduledDate, periodLabel, phaseLabel, teamsLabel } from "../utils/match-card"

export function ScheduledMatchRow({ match, onStart }: { match: Match; onStart: (match: Match) => void }) {
  const date = formatScheduledDate(match.scheduled_date)
  const phase = phaseLabel(match)

  return (
    <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
      <p className="type-body w-full font-bold text-ink sm:w-36">
        {date ? <time dateTime={match.scheduled_date ?? undefined}>{date}</time> : "Data a definir"}
      </p>
      <div className="min-w-0 flex-1 basis-48">
        <p className="type-body truncate font-bold text-ink">{teamsLabel(match)}</p>
        {phase && <p className="type-caption text-muted-foreground">{phase}</p>}
      </div>
      <p className="type-body-sm text-muted-foreground sm:w-40">{match.modality_name}</p>
      <Badge>Agendada</Badge>
      <Button size="sm" onClick={() => onStart(match)}>
        Iniciar partida
      </Button>
    </Card>
  )
}

const score = (team: MatchTeam | null) => (team ? team.score : "–")

export function LiveMatchRow({ match }: { match: Match }) {
  const period = periodLabel(match.current_period)
  const context = [match.modality_name, phaseLabel(match)].filter(Boolean).join(" · ")

  return (
    <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 border-primary bg-primary-soft p-4">
      <Badge variant="danger">
        {match.clock_running && <LiveDot />}
        {match.clock_running ? "Ao vivo" : "Em andamento"}
      </Badge>
      <div className="min-w-0 flex-1 basis-48">
        <p className="type-body truncate font-bold text-ink">{teamsLabel(match)}</p>
        <p className="type-caption text-muted-foreground">{context}</p>
      </div>
      <p className="type-section tabular-nums text-ink">
        <span className="sr-only">Placar </span>
        {score(match.team1)} – {score(match.team2)}
      </p>
      <p className="type-caption text-muted-foreground">
        {formatClock(match.clock_seconds)}
        {period ? ` · ${period}` : ""}
      </p>
      <Button asChild size="sm" variant="outline">
        <Link href={`${MANAGE_PATH}/${match.match_id}`}>Gerenciar</Link>
      </Button>
    </Card>
  )
}
