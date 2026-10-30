import { LiveDot } from "@/shared/components/live-dot"
import { Avatar } from "@/shared/components/ui/avatar"
import { STATUS_OPTIONS } from "../constants"
import type { MatchDetail, MatchTeam } from "../types/match"
import { formatScheduledDate, isVolleyMatch, periodLabel, phaseLabel } from "../utils/match-card"
import { LiveClock } from "./live-clock"

function Team({ team }: { team: MatchTeam | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Avatar name={team?.name} tone="inverse" size="lg" />
      <span className="w-full wrap-break-word text-sm font-bold">{team?.name ?? "A definir"}</span>
    </div>
  )
}

export function MatchHeader({ match }: { match: MatchDetail }) {
  const { team1, team2, status } = match
  const volley = isVolleyMatch(match)
  const shootout = team1?.penalty_score != null && team2?.penalty_score != null
  const live = status === "IN_PROGRESS"
  const currentSet = volley && live
  const main = (t: MatchTeam | null) => (t && status !== "SCHEDULED" ? ((volley && !live ? t.sets_won : t.score) ?? "–") : "–")
  const penalty = (t: MatchTeam | null) => shootout && <span className="text-2xl"> ({t?.penalty_score})</span>

  const phase = phaseLabel(match)
  const date = formatScheduledDate(match.scheduled_date)
  const period = !volley && live ? periodLabel(match.current_period) : null
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label
  const pastSets = match.sets.map((s) => `${s.team1_points}–${s.team2_points}`).join(" · ")

  return (
    <article className="space-y-4 rounded-xl bg-linear-to-b from-primary to-primary-dark p-5 text-white shadow-primary">
      <header className="flex items-center justify-between gap-3">
        <span className="type-overline inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5">
          {live && match.clock_running && <LiveDot />}
          {live && match.clock_running ? "Ao vivo" : statusLabel}
        </span>
        <span className="type-caption text-white/80">
          {period}
          {period && live && " · "}
          {live && <LiveClock seconds={match.clock_seconds} running={match.clock_running} />}
        </span>
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Team team={team1} />
        <div className="flex flex-col items-center gap-1">
          <p className="type-score">
            <span className="sr-only">{currentSet ? "Placar do set atual " : "Placar "}</span>
            {main(team1)}
            {penalty(team1)} – {main(team2)}
            {penalty(team2)}
          </p>
          {currentSet && team1 && team2 && (
            <>
              <p className="type-caption text-white/80">Set {match.sets.length + 1}</p>
              <p className="type-label tabular-nums text-white/90">
                <span className="sr-only">Sets ganhos </span>
                {team1.sets_won ?? 0} – {team2.sets_won ?? 0}
              </p>
            </>
          )}
        </div>
        <Team team={team2} />
      </div>
      {pastSets && <p className="type-caption text-center text-white/80">Parciais: {pastSets}</p>}
      <footer className="space-y-0.5 text-center">
        <p className="truncate text-sm font-bold">{match.modality_name}</p>
        <p className="type-caption text-white/80">{[phase, date].filter(Boolean).join(" · ")}</p>
      </footer>
    </article>
  )
}
