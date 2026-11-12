import { cn } from "@/lib/utils"
import type { MatchDetail } from "../types/match"
import { timelineRows } from "../utils/match-timeline"

type Props = { match: MatchDetail; title?: string; onSelect?: (eventId: string) => void }

export function MatchTimeline({ match, title = "Lances", onSelect }: Props) {
  const rows = timelineRows(match)
  return (
    <section className="space-y-3">
      <h2 className="type-section text-ink">{title}</h2>
      {rows.length ? (
        <ol className="space-y-2">
          {rows.map(({ id, correctable, type: { icon: Icon, className }, label, clock, team, player }) => {
            const content = (
              <>
                <Icon className={cn("size-5 shrink-0 text-muted-foreground", className)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="type-body-sm truncate font-bold text-ink">{player ? `${label} · ${player}` : label}</p>
                  {team && <p className="type-caption truncate text-muted-foreground">{team}</p>}
                </div>
                {clock && <span className="type-label tabular-nums text-muted-foreground">{clock}</span>}
              </>
            )
            return (
              <li key={id} className="rounded-md bg-field">
                {onSelect && correctable ? (
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left outline-none transition-colors hover:bg-border/60 focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2.5">{content}</div>
                )}
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="type-body-sm text-muted-foreground">Nenhum evento ainda.</p>
      )}
    </section>
  )
}
