import { Trophy } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import type { ModalityGroup } from "../utils/match-groups"
import { MatchRow } from "./match-row"

export function ModalitySection({ group }: { group: ModalityGroup }) {
  const id = `modality-${group.modality_id}`
  return (
    <section aria-labelledby={id} className="space-y-2">
      <header className="flex items-center gap-3 px-1">
        <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-xs bg-primary-soft text-primary-dark">
          <Trophy className="size-4" />
        </span>
        <h2 id={id} className="type-section flex-1 truncate text-ink">{group.name}</h2>
        <Badge>{group.matches.length}</Badge>
      </header>
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-card">
        {group.matches.map((m) => (
          <MatchRow key={m.match_id} match={m} />
        ))}
      </ul>
    </section>
  )
}
