import Link from "next/link"
import { LiveDot } from "@/shared/components/live-dot"
import { Avatar } from "@/shared/components/ui/avatar"
import type { Match, MatchTeam } from "../types/match"
import { formatClock, isVolleyMatch, periodLabel, phaseLabel, scoreOf } from "../utils/match-card"

function Side({ team }: { team: MatchTeam | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Avatar name={team?.name} tone="inverse" size="lg" />
      <span className="line-clamp-2 w-full text-sm font-bold wrap-break-word">{team?.name ?? "A definir"}</span>
    </div>
  )
}

export function LiveMatchCard({ match }: { match: Match }) {
  const phase = phaseLabel(match)
  const volley = isVolleyMatch(match)
  const detail = volley ? null : [periodLabel(match.current_period), formatClock(match.clock_seconds)].filter(Boolean).join(" · ")
  return (
    <Link
      href={`/partidas/${match.match_id}`}
      className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <article className="flex h-full flex-col gap-4 rounded-xl bg-linear-to-b from-primary to-primary-dark p-4 text-white shadow-primary">
        <header className="flex items-center justify-between gap-3">
          <span className="type-overline inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5">
            {match.clock_running && <LiveDot />}
            {match.clock_running ? "Ao vivo" : "Em andamento"}
          </span>
          {detail && <span className="type-caption text-white/80 tabular-nums">{detail}</span>}
        </header>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Side team={match.team1} />
          <p className="type-score">
            <span className="sr-only">Placar </span>
            {scoreOf(match, match.team1)} – {scoreOf(match, match.team2)}
          </p>
          <Side team={match.team2} />
        </div>
        <footer className="mt-auto truncate text-center type-caption text-white/80">
          {[match.modality_name, phase].filter(Boolean).join(" · ")}
        </footer>
      </article>
    </Link>
  )
}
