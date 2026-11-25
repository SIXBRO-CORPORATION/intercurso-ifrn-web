import { Card, CardHeader } from "@/shared/components/ui/card"
import type { MatchDetail } from "../../types/match"

export function SetHistory({ match: { sets, team1, team2 } }: { match: MatchDetail }) {
  return (
    <Card>
      <CardHeader title="Histórico de sets" />
      {sets.length ? (
        <ol className="divide-y divide-border">
          {sets.map(({ set_number, team1_points, team2_points }) => (
            <li key={set_number} className="flex min-h-10 items-center justify-between gap-3 px-4 py-2">
              <span className="type-h3">Set {set_number}</span>
              <span className="type-small text-text-secondary tabular-nums">
                {team1?.name} {team1_points} – {team2_points} {team2?.name}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="type-small p-4 text-muted-foreground">Nenhum set encerrado ainda.</p>
      )}
    </Card>
  )
}
