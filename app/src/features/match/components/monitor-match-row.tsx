import Link from "next/link"
import type { ReactNode } from "react"
import type { Modality } from "@/features/modality"
import { cn } from "@/lib/utils"
import { LiveDot } from "@/shared/components/live-dot"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { MANAGE_PATH } from "../constants"
import type { Match, MatchTeam } from "../types/match"
import { clockLimit, formatScheduledSlot, isVolleyMatch, periodLabel, roundLabel, stageLabel, teamsLabel } from "../utils/match-card"
import { LiveClock } from "./live-clock"

const th = "type-overline px-5 py-3 text-left font-bold text-muted-foreground"
const td = "px-5 py-4 align-middle"

function MatchTable({ caption, headers, className, children }: { caption: string; headers: string[]; className?: string; children: ReactNode }) {
  return (
    <Card className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-176 border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-border">
          <tr>
            {headers.map((header) => (
              <th key={header || "actions"} scope="col" className={th}>
                {header || <span className="sr-only">Ações</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </Card>
  )
}

function MatchCell({ match }: { match: Match }) {
  const round = roundLabel(match)
  return (
    <td className={td}>
      <p className="type-body max-w-72 truncate font-bold text-ink">{teamsLabel(match)}</p>
      {round && <p className="type-caption text-muted-foreground">{round}</p>}
    </td>
  )
}

function ContextCells({ match }: { match: Match }) {
  return (
    <>
      <td className={cn(td, "type-body-sm")}>{match.modality_name}</td>
      <td className={cn(td, "type-body-sm")}>{stageLabel(match) ?? "–"}</td>
    </>
  )
}

export function ScheduledMatchTable({ matches, onStart }: { matches: Match[]; onStart: (match: Match) => void }) {
  return (
    <MatchTable caption="Partidas agendadas" headers={["Horário", "Partida", "Modalidade", "Fase", "Status", ""]}>
      {matches.map((match) => {
        const slot = formatScheduledSlot(match.scheduled_date)
        return (
          <tr key={match.match_id}>
            <td className={td}>
              {slot ? (
                <time dateTime={match.scheduled_date ?? undefined} className="block">
                  <span className="type-body block font-bold text-ink">{slot.time ?? slot.date}</span>
                  {slot.time && <span className="type-caption text-muted-foreground">{slot.date}</span>}
                </time>
              ) : (
                <span className="type-body-sm text-muted-foreground">A definir</span>
              )}
            </td>
            <MatchCell match={match} />
            <ContextCells match={match} />
            <td className={td}>
              <Badge>Agendada</Badge>
            </td>
            <td className={cn(td, "text-right")}>
              <Button size="sm" onClick={() => onStart(match)}>
                Iniciar partida
              </Button>
            </td>
          </tr>
        )
      })}
    </MatchTable>
  )
}

const score = (team: MatchTeam | null) => (team ? team.score : "–")

export function LiveMatchTable({ matches, modalities }: { matches: Match[]; modalities: Modality[] }) {
  return (
    <MatchTable
      caption="Partidas em andamento"
      headers={["Partida", "Modalidade", "Fase", "Placar", "Tempo", "Status", ""]}
      className="border-primary"
    >
      {matches.map((match) => {
        const volley = isVolleyMatch(match)
        const period = volley ? null : periodLabel(match.current_period)
        const modality = modalities.find((m) => m.modality_id === match.modality_id)
        return (
          <tr key={match.match_id}>
            <MatchCell match={match} />
            <ContextCells match={match} />
            <td className={cn(td, "type-section tabular-nums text-ink")}>
              <span className="sr-only">Placar </span>
              {score(match.team1)} – {score(match.team2)}
            </td>
            <td className={td}>
              <p className="type-body font-bold tabular-nums text-ink">
                {volley ? (
                  <>
                    <span className="sr-only">Sets </span>
                    {match.team1?.sets_won ?? 0} – {match.team2?.sets_won ?? 0}
                  </>
                ) : (
                  <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={clockLimit(modality, match.current_period)} />
                )}
              </p>
              {period && <p className="type-caption text-muted-foreground">{period}</p>}
            </td>
            <td className={td}>
              <Badge variant="danger">
                {match.clock_running && <LiveDot />}
                {match.clock_running ? "Ao vivo" : "Em andamento"}
              </Badge>
            </td>
            <td className={cn(td, "text-right")}>
              <Button asChild size="sm" variant="outline">
                <Link href={`${MANAGE_PATH}/${match.match_id}`}>Gerenciar</Link>
              </Button>
            </td>
          </tr>
        )
      })}
    </MatchTable>
  )
}

const finalScore = (match: Match) =>
  isVolleyMatch(match) ? `${match.team1?.sets_won ?? 0} – ${match.team2?.sets_won ?? 0}` : `${score(match.team1)} – ${score(match.team2)}`

export function FinishedMatchTable({ matches }: { matches: Match[] }) {
  return (
    <MatchTable caption="Partidas encerradas" headers={["Data", "Partida", "Modalidade", "Fase", "Placar", "Status", ""]}>
      {matches.map((match) => {
        const slot = formatScheduledSlot(match.scheduled_date)
        return (
          <tr key={match.match_id}>
            <td className={td}>
              {slot ? (
                <time dateTime={match.scheduled_date ?? undefined} className="block">
                  <span className="type-body block font-bold text-ink">{slot.date}</span>
                  {slot.time && <span className="type-caption text-muted-foreground">{slot.time}</span>}
                </time>
              ) : (
                <span className="type-body-sm text-muted-foreground">–</span>
              )}
            </td>
            <MatchCell match={match} />
            <ContextCells match={match} />
            <td className={cn(td, "type-section tabular-nums text-ink")}>
              <span className="sr-only">Placar </span>
              {finalScore(match)}
            </td>
            <td className={td}>
              <Badge>Encerrada</Badge>
            </td>
            <td className={cn(td, "text-right")}>
              <Button asChild size="sm" variant="outline">
                <Link href={`/partidas/${match.match_id}`}>Ver partida</Link>
              </Button>
            </td>
          </tr>
        )
      })}
    </MatchTable>
  )
}
