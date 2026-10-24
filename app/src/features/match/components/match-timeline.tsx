import { cn } from "@/lib/utils"
import type { MatchDetail } from "../types/match"
import { timelineRows } from "../utils/match-timeline"

export function MatchTimeline({ match }: { match: MatchDetail }) {
  const rows = timelineRows(match)
  return (
    <section className="space-y-3">
      <h2 className="type-section text-ink">Lances</h2>
      {rows.length ? (
        <ol className="space-y-2">
          {rows.map(({ id, type: { icon: Icon, className }, label, clock, team, player }) => (
            <li key={id} className="flex items-center gap-3 rounded-md bg-field px-3 py-2.5">
              <Icon className={cn("size-5 shrink-0 text-muted-foreground", className)} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="type-body-sm truncate font-bold text-ink">{player ? `${label} · ${player}` : label}</p>
                {team && <p className="type-caption truncate text-muted-foreground">{team}</p>}
              </div>
              {clock && <span className="type-label tabular-nums text-muted-foreground">{clock}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <p className="type-body-sm text-muted-foreground">Nenhum evento ainda.</p>
      )}
    </section>
  )
}
