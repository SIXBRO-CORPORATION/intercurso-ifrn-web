import { Play } from "lucide-react"
import { LiveDot } from "@/shared/components/live-dot"
import { Button } from "@/shared/components/ui/button"
import type { MatchDetail, MatchTeam } from "../../types/match"
import { isVolleyMatch, matchClockLimit, periodLabel } from "../../utils/match-card"
import { LiveClock } from "../live-clock"

const ACTION = "type-label h-11 rounded-full bg-white/20 font-bold text-white/70"

export function ConsoleScoreboard({ match, onPlay }: { match: MatchDetail; onPlay: () => void }) {
  const { team1, team2, status } = match
  const volley = isVolleyMatch(match)
  const live = status === "IN_PROGRESS"
  const shootout = team1?.penalty_score != null && team2?.penalty_score != null
  const value = (t: MatchTeam | null) => (volley && status === "FINISHED" ? t?.sets_won : t?.score) ?? 0
  const state = live ? (match.clock_running ? "Rodando" : "Pausado") : status === "FINISHED" ? "Encerrada" : "Aguardando início"

  return (
    <section aria-label="Placar" className="space-y-5 rounded-xl bg-linear-to-b from-primary to-primary-dark p-5 text-white shadow-primary">
      <header className="flex items-center justify-between gap-3">
        <span className="type-overline text-white/80">{(!volley && live && periodLabel(match.current_period)) || "\u00a0"}</span>
        <span className="type-label inline-flex items-center gap-1.5 text-white/80">
          {state}
          {live && <LiveDot className={match.clock_running ? "text-white" : "text-white/50"} />}
        </span>
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <p className="type-body-lg wrap-break-word font-bold">{team1?.name ?? "A definir"}</p>
        <p className="type-score tabular-nums">
          <span className="sr-only">Placar </span>
          {value(team1)} – {value(team2)}
        </p>
        <p className="type-body-lg wrap-break-word font-bold">{team2?.name ?? "A definir"}</p>
      </div>
      {shootout && (
        <p className="type-label text-center text-white/80">
          Pênaltis {team1?.penalty_score} – {team2?.penalty_score}
        </p>
      )}
      {live && (
        <p className="type-heading mx-auto w-fit rounded-full bg-white/20 px-6 py-2 text-center tabular-nums">
          {volley ? (
            `Set ${match.sets.length + 1} · Sets ${team1?.sets_won ?? 0} – ${team2?.sets_won ?? 0}`
          ) : (
            <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={matchClockLimit(match)} />
          )}
        </p>
      )}
      {status === "SCHEDULED" && (
        <Button variant="dark" size="lg" className="w-full" onClick={onPlay}>
          <Play aria-hidden /> Play
        </Button>
      )}
      {status !== "FINISHED" && (
        <div className="grid grid-cols-3 gap-2">
          <button type="button" disabled className={ACTION}>{match.clock_running ? "Pausar" : "Retomar"}</button>
          <button type="button" disabled className={ACTION}>Fim do período</button>
          <button type="button" disabled className={ACTION}>Desfazer</button>
        </div>
      )}
    </section>
  )
}
