import type { MatchDetail } from "../types/match"

export function MatchRoster({ match }: { match: MatchDetail }) {
  const sides = [
    { team: match.team1, players: match.team1_players },
    { team: match.team2, players: match.team2_players },
  ]
  return (
    <section className="space-y-3">
      <h2 className="type-section text-ink">Elencos</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {sides.map(({ team, players }, i) => (
          <div key={team?.team_id ?? i} className="space-y-2">
            <h3 className="type-label font-bold text-primary-dark">{team?.name ?? "A definir"}</h3>
            {players.length ? (
              <ul className="space-y-1">
                {players.map((p) => (
                  <li key={p.user_id} className="type-body-sm rounded-md bg-field px-3 py-2 text-ink">{p.name}</li>
                ))}
              </ul>
            ) : (
              <p className="type-body-sm text-muted-foreground">Elenco não disponível.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
