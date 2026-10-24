import { cn } from "@/lib/utils"
import type { MatchDetail } from "../types/match"
import { timelineRows } from "../utils/match-timeline"

type Row = ReturnType<typeof timelineRows>[number]

function EventCard({ row, align }: { row: Row; align: "left" | "right" }) {
  const { icon: Icon, className } = row.type
  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-md bg-field px-3 py-2", align === "left" ? "flex-row-reverse text-right" : "text-left")}>
      <Icon className={cn("size-5 shrink-0 text-muted-foreground", className)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="type-body-sm truncate font-bold text-ink">{row.label}</p>
        {row.player && <p className="type-caption truncate text-muted-foreground">{row.player}</p>}
      </div>
    </div>
  )
}

function Minute({ value }: { value: string | null }) {
  if (!value) return <span aria-hidden className="relative z-10 size-2.5 justify-self-center rounded-full border border-border bg-card" />
  return (
    <span className="relative z-10 grid h-7 min-w-12 place-items-center justify-self-center rounded-full border border-border bg-card px-2 type-caption font-bold text-muted-foreground tabular-nums">
      {value}
    </span>
  )
}

function TimelineRow({ row }: { row: Row }) {
  if (!row.side) {
    const { icon: Icon, className } = row.type
    return (
      <li className="relative z-10 flex justify-center py-1.5">
        <span className="type-caption inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 font-bold text-ink">
          <Icon className={cn("size-3.5 text-muted-foreground", className)} aria-hidden />
          {row.label}
          {row.clock && <span className="font-medium text-muted-foreground tabular-nums">{row.clock}</span>}
        </span>
      </li>
    )
  }
  return (
    <li className="grid grid-cols-[1fr_3.75rem_1fr] items-center gap-2 py-1.5">
      <div>{row.side === 1 && <EventCard row={row} align="left" />}</div>
      <Minute value={row.clock} />
      <div>{row.side === 2 && <EventCard row={row} align="right" />}</div>
    </li>
  )
}

export function MatchTimeline({ match }: { match: MatchDetail }) {
  const rows = timelineRows(match)
  return (
    <section className="space-y-3">
      <h2 className="sr-only">Lances</h2>
      {rows.length ? (
        <>
          <div className="type-label grid grid-cols-[1fr_3.75rem_1fr] gap-2 font-bold text-primary-dark" aria-hidden>
            <span className="truncate text-right">{match.team1?.name}</span>
            <span />
            <span className="truncate">{match.team2?.name}</span>
          </div>
          <ol className="relative before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-border">
            {rows.map((row) => (
              <TimelineRow key={row.id} row={row} />
            ))}
          </ol>
        </>
      ) : (
        <p className="type-body-sm rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">Nenhum lance registrado ainda.</p>
      )}
    </section>
  )
}
