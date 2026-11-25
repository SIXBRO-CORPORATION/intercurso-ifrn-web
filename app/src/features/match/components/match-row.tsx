import { cn } from "@/lib/utils"
import { Avatar } from "@/shared/components/ui/avatar"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import type { Match, MatchTeam } from "../types/match"
import { formatScheduledSlot, isVolleyMatch } from "../utils/match-card"
import { hasShootout, withPenalties } from "../utils/match-penalties"
import { LiveClock } from "./live-clock"

function When({ match, limit }: { match: Match; limit: number | null }) {
  if (match.status === "IN_PROGRESS") {
    const volley = isVolleyMatch(match)
    const set = (match.team1?.sets_won ?? 0) + (match.team2?.sets_won ?? 0) + 1
    return (
      <>
        <span className="sr-only">Ao vivo </span>
        <span>
          {volley ? `${set}º set` : <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={limit} />}
        </span>
        {!match.clock_running && !volley && <span className="text-[0.625rem] font-medium">Parado</span>}
      </>
    )
  }
  const slot = formatScheduledSlot(match.scheduled_date)
  return (
    <>
      {slot ? (
        <time dateTime={match.scheduled_date ?? undefined} className="flex flex-col items-center">
          {slot.time && <span>{slot.time}</span>}
          <span>{slot.date}</span>
        </time>
      ) : (
        <span>
          <span aria-hidden>–</span>
          <span className="sr-only">Data a definir</span>
        </span>
      )}
      {match.status === "FINISHED" && <span>Fim</span>}
    </>
  )
}

type Props = { match: Match; meta?: string; limit?: number | null }

/** Linha de partida: horário | equipes | placar. Quem usa decide se ela é link ou tem ação ao lado. */
export function MatchRow({ match, meta, limit = null }: Props) {
  const live = match.status === "IN_PROGRESS"
  const finished = match.status === "FINISHED"
  const shootout = finished && hasShootout(match)
  const lost = (team: MatchTeam | null) => finished && !!match.winner_id && match.winner_id !== team?.team_id
  const won = (team: MatchTeam | null) => !!team && match.winner_id === team.team_id
  const score = (team: MatchTeam | null) => {
    if (match.status === "SCHEDULED" || !team) return ""
    return withPenalties((finished && isVolleyMatch(match) ? team.sets_won : team.score) ?? 0, team, shootout)
  }

  return (
    <div className="grid min-h-14 grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-2 pr-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 self-stretch border-r border-border text-xs leading-tight font-medium text-muted-foreground tabular-nums",
          live && "font-bold text-live",
        )}
      >
        <When match={match} limit={limit} />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        {[match.team1, match.team2].map((team, i) => (
          <div key={i} className={cn("flex min-w-0 items-center gap-2", lost(team) && "text-text-secondary", won(team) && "font-bold")}>
            <Avatar size="xs" name={team?.name} src={resolvePhotoSrc(team?.photo)} />
            <span className={cn("truncate", !team && "text-muted-foreground italic")}>{team?.name ?? "A definir"}</span>
            {won(team) && <span className="sr-only">Vencedor</span>}
          </div>
        ))}
        {meta && <p className="type-small truncate text-muted-foreground">{meta}</p>}
      </div>
      <div className={cn("flex flex-col items-end gap-1.5 font-bold tabular-nums", live && "text-live")}>
        {[match.team1, match.team2].map((team, i) => (
          <span key={i} className={cn("flex h-5.25 items-center", lost(team) && "font-medium text-text-secondary")}>
            {score(team)}
          </span>
        ))}
      </div>
    </div>
  )
}
