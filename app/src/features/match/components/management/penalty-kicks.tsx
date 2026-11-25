import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader } from "@/shared/components/ui/card"
import type { MatchDetail } from "../../types/match"
import { penaltyKicks } from "../../utils/match-penalties"

export function PenaltyKicks({ match }: { match: MatchDetail }) {
  const kicks = penaltyKicks(match)
  return (
    <Card>
      <CardHeader title="Cobranças" />
      {kicks.length ? (
        <ol className="divide-y divide-border">
          {kicks.map(({ id, team, player, scored, order }) => {
            const Icon = scored ? Check : X
            return (
              <li key={id} className="flex min-h-10 items-center gap-2.5 px-4 py-1.5">
                <span
                  className={cn(
                    "grid size-7.5 shrink-0 place-items-center rounded-full border",
                    scored ? "border-primary text-primary-text" : "border-border bg-sunken text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="sr-only">{scored ? "Convertido" : "Perdido"}</span>
                </span>
                <p className="min-w-0 flex-1 truncate font-semibold">{[team, player].filter(Boolean).join(" · ")}</p>
                <span className="type-small shrink-0 text-muted-foreground">{order}ª cobrança</span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="type-small p-4 text-muted-foreground">Nenhuma cobrança ainda.</p>
      )}
    </Card>
  )
}
