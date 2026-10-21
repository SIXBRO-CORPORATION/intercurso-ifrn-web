import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/shared/components/ui/card"

export function MatchListLoading() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Carregando partidas…</span>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="h-48 rounded-xl bg-border/60 motion-safe:animate-pulse" />
        ))}
      </ul>
    </div>
  )
}

export function MatchListMessage({ title, children, alert }: { title: string; children?: ReactNode; alert?: boolean }) {
  return (
    <Card
      role={alert ? "alert" : "status"}
      className={cn("flex flex-col items-center gap-3 p-8 text-center", alert && "border-transparent bg-danger-soft")}
    >
      <p className={cn("type-section", alert ? "text-danger" : "text-ink")}>{title}</p>
      {children && <div className="type-body-sm text-muted-foreground">{children}</div>}
    </Card>
  )
}
