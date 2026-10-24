import { LiveDot } from "@/shared/components/live-dot"
import { Avatar } from "@/shared/components/ui/avatar"
import { STATUS_OPTIONS } from "../constants"
import type { MatchDetail, MatchTeam } from "../types/match"
import { formatClock, formatScheduledDate, isVolleyMatch, periodLabel, phaseLabel, scoreOf } from "../utils/match-card"

function Side({ team }: { team: MatchTeam | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
      <Avatar name={team?.name} tone="inverse" size="lg" className="size-16 text-2xl" />
      <span className="line-clamp-2 w-full text-sm font-bold wrap-break-word">{team?.name ?? "A definir"}</span>
    </div>
  )
}

export function MatchHeader({ match }: { match: MatchDetail }) {
  const { team1, team2, status } = match
  const volley = isVolleyMatch(match)
  const live = status === "IN_PROGRESS"
  const shootout = team1?.penalty_score != null && team2?.penalty_score != null
  const phase = phaseLabel(match)
  const date = formatScheduledDate(match.scheduled_date)
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label
  const period = !volley && live ? periodLabel(match.current_period) : null
  const clock = !volley && live ? [period, formatClock(match.clock_seconds)].filter(Boolean).join(" · ") : null
  const currentSet = volley && live && team1 && team2 ? `Set ${match.sets.length + 1}: ${team1.score} – ${team2.score}` : null
  const footer = [currentSet, date ?? (status === "SCHEDULED" ? "Data a definir" : null)].filter(Boolean)

  return (
    <article className="overflow-hidden rounded-xl bg-linear-to-b from-primary to-primary-dark text-white shadow-primary">
      <header className="flex items-center justify-between gap-3 px-5 pt-4">
        <p className="type-overline truncate">{[match.modality_name, phase].filter(Boolean).join(" · ")}</p>
        <span className="type-overline inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5">
          {live && match.clock_running && <LiveDot />}
          {live && match.clock_running ? "Ao vivo" : statusLabel}
        </span>
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6">
        <Side team={team1} />
        <div className="flex flex-col items-center gap-1.5">
          <p className="type-score">
            <span className="sr-only">Placar </span>
            {scoreOf(match, team1)} – {scoreOf(match, team2)}
          </p>
          {shootout && (
            <p className="type-caption rounded-full bg-white/20 px-2.5 py-0.5 font-bold tabular-nums">
              Pênaltis {team1?.penalty_score} – {team2?.penalty_score}
            </p>
          )}
          {clock && <p className="type-caption text-white/80 tabular-nums">{clock}</p>}
        </div>
        <Side team={team2} />
      </div>
      {(match.sets.length > 0 || footer.length > 0) && (
        <footer className="space-y-2 bg-black/10 px-5 py-3 text-center">
          {match.sets.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Sets">
              {match.sets.map((s) => (
                <li key={s.set_number} className="type-caption rounded-full bg-white/15 px-2.5 py-0.5 font-bold tabular-nums">
                  {s.team1_points}–{s.team2_points}
                </li>
              ))}
            </ul>
          )}
          {footer.length > 0 && <p className="type-caption text-white/85">{footer.join(" · ")}</p>}
        </footer>
      )}
    </article>
  )
}
