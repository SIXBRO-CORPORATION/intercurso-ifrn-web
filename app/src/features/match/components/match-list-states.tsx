import type { ReactNode } from "react"

export function MatchListLoading() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Carregando partidas…</span>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="h-32 rounded-xl border bg-brand-100/60 motion-safe:animate-pulse" />
        ))}
      </ul>
    </div>
  )
}

export function MatchListMessage({ title, children, alert }: { title: string; children?: ReactNode; alert?: boolean }) {
  return (
    <div role={alert ? "alert" : "status"} className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center">
      <p className={alert ? "font-semibold text-destructive" : "font-semibold text-brand-900"}>{title}</p>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}

