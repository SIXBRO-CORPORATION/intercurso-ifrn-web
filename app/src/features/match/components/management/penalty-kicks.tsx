import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/shared/components/ui/card"
import type { MatchDetail } from "../../types/match"
import { penaltyKicks } from "../../utils/match-penalties"

export function PenaltyKicks({ match }: { match: MatchDetail }) {
  const kicks = penaltyKicks(match)
  return (
    <Card className="space-y-3 p-5">
      <h2 className="type-section text-ink">Cobranças</h2>
      {kicks.length ? (
        <ol className="space-y-2">
          {kicks.map(({ id, team, player, scored, order }) => {
            const Icon = scored ? Check : X
            return (
              <li key={id} className="flex items-center gap-3 rounded-md bg-field px-3 py-2.5">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-white",
                    scored ? "bg-primary" : "bg-danger",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="sr-only">{scored ? "Convertido" : "Perdido"}</span>
                </span>
                <p className="type-body-sm min-w-0 flex-1 truncate font-bold text-ink">
                  {[team, player].filter(Boolean).join(" · ")}
                </p>
                <span className="type-caption shrink-0 text-muted-foreground">{order}ª cobrança</span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="type-body-sm text-muted-foreground">Nenhuma cobrança ainda.</p>
      )}
    </Card>
  )
}
