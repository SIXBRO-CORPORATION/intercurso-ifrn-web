import { cn } from "@/lib/utils"
import { LiveDot } from "@/shared/components/live-dot"
import { STATUS_OPTIONS } from "../constants"
import type { MatchDetail, MatchTeam } from "../types/match"
import { formatScheduledDate, formatScheduledSlot, isVolleyMatch, matchClockLimit, periodLabel } from "../utils/match-card"
import { hasShootout, withPenalties } from "../utils/match-penalties"
import { LiveClock } from "./live-clock"
import { Scoreboard } from "./scoreboard"

export function MatchHeader({ match }: { match: MatchDetail }) {
  const { team1, team2, status } = match
  const volley = isVolleyMatch(match)
  const shootout = hasShootout(match)
  const live = status === "IN_PROGRESS"
  const scheduled = status === "SCHEDULED"
  const main = (t: MatchTeam | null) => withPenalties(t ? ((volley && !live ? t.sets_won : t.score) ?? "–") : "–", t, shootout)

  const date = formatScheduledDate(match.scheduled_date)
  const period = !volley && live ? periodLabel(match.current_period) : null
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label

  return (
    <Scoreboard team1={team1} team2={team2}>
      {scheduled ? (
        <p className="type-score text-muted-foreground">{formatScheduledSlot(match.scheduled_date)?.time ?? "–"}</p>
      ) : (
        <p className={cn("type-score", live && "text-live")}>
          <span className="sr-only">{volley && live ? "Placar do set atual " : "Placar "}</span>
          {main(team1)} – {main(team2)}
        </p>
      )}
      {live ? (
        <>
          <p className="type-small flex items-center gap-1.5 font-bold text-live uppercase">
            {match.clock_running && <LiveDot />}
            {match.clock_running ? "Ao vivo" : statusLabel}
          </p>
          {!volley && (
            <p className="type-small flex gap-1.5 font-bold text-live tabular-nums">
              {period && <span>{period}</span>}
              <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={matchClockLimit(match)} />
            </p>
          )}
        </>
      ) : (
        <p className="type-small text-text-secondary">{statusLabel}</p>
      )}
      {volley && live && (
        <p className="type-small text-text-secondary tabular-nums">
          Set {match.sets.length + 1} · <span className="sr-only">Sets ganhos </span>
          {team1?.sets_won ?? 0} – {team2?.sets_won ?? 0}
        </p>
      )}
      {match.sets.length > 0 && (
        <ul aria-label="Parciais" className="flex flex-wrap justify-center gap-1.5">
          {match.sets.map((s) => (
            <li key={s.set_number} className="rounded-xs bg-muted px-1.5 py-0.5 text-xs font-semibold text-text-secondary tabular-nums">
              {s.team1_points}–{s.team2_points}
            </li>
          ))}
        </ul>
      )}
      {date && <p className="type-small text-muted-foreground">{date}</p>}
    </Scoreboard>
  )
}
