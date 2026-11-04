import type { MatchDetail } from "../../types/match"

export function SetHistory({ match: { sets, team1, team2 } }: { match: MatchDetail }) {
  return (
    <section className="space-y-3">
      <h2 className="type-section text-ink">Histórico de sets</h2>
      {sets.length ? (
        <ol className="space-y-2">
          {sets.map(({ set_number, team1_points, team2_points }) => (
            <li key={set_number} className="flex items-center justify-between gap-3 rounded-md bg-field px-3 py-2.5">
              <span className="type-body-sm font-bold text-ink">Set {set_number}</span>
              <span className="type-body-sm tabular-nums text-muted-foreground">
                {team1?.name} {team1_points} – {team2_points} {team2?.name}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="type-body-sm text-muted-foreground">Nenhum set encerrado ainda.</p>
      )}
    </section>
  )
}
