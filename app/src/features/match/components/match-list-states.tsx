import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/shared/components/ui/card"

export function MatchListLoading() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Carregando partidas…</span>
      <div className="space-y-6" aria-hidden>
        {Array.from({ length: 2 }, (_, g) => (
          <div key={g} className="space-y-2">
            <div className="h-8 w-40 rounded-xs bg-border/60 motion-safe:animate-pulse" />
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {Array.from({ length: 3 }, (_, i) => (
                <li key={i} className="h-20 motion-safe:animate-pulse bg-border/30" />
              ))}
            </ul>
          </div>
        ))}
      </div>
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
