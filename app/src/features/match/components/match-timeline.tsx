import { cn } from "@/lib/utils"
import type { MatchDetail } from "../types/match"
import { timelineRows } from "../utils/match-timeline"

type Props = { match: MatchDetail; onSelect?: (eventId: string) => void }

const CLICKABLE = "w-full text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"

export function MatchTimeline({ match, onSelect }: Props) {
  const rows = timelineRows(match)
  if (!rows.length) return <p className="type-small px-4 py-8 text-center text-muted-foreground">Nenhum evento ainda.</p>

  return (
    <ol className="py-1">
      {rows.map(({ id, correctable, type: { icon: Icon, className }, label, clock, team, player, side }) => {
        const content = side ? (
          <>
            <span className={cn("w-11 shrink-0 text-xs font-semibold text-text-secondary tabular-nums", side === "away" && "text-right")}>
              {clock}
            </span>
            <span className="grid size-7.5 shrink-0 place-items-center rounded-full border border-border bg-sunken">
              <Icon className={cn("size-4", className)} aria-hidden />
            </span>
            <span className="max-w-3/5 shrink-0 truncate font-semibold">{player ?? label}</span>
            {player && <span className="min-w-0 truncate text-muted-foreground">{label}</span>}
            {team && <span className="sr-only"> ({team})</span>}
          </>
        ) : (
          <>
            <span className="flex-1 truncate">{label}</span>
            {clock && <span className="text-foreground tabular-nums">{clock}</span>}
          </>
        )
        const row = cn(
          "flex items-center gap-2.5",
          side ? "min-h-10 px-4 py-1" : "type-overline mx-3 my-1 min-h-8 rounded-md bg-muted px-3 text-text-secondary",
          side === "away" && "flex-row-reverse",
        )
        return (
          <li key={id}>
            {onSelect && correctable ? (
              <button type="button" onClick={() => onSelect(id)} className={cn(row, CLICKABLE, !side && "w-[calc(100%-1.5rem)]")}>
                {content}
              </button>
            ) : (
              <div className={row}>{content}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
