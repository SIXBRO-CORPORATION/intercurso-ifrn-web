import { Avatar } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import type { MatchDetail } from "../types/match"

export function MatchRoster({ match }: { match: MatchDetail }) {
  const sides = [
    { team: match.team1, players: match.team1_players },
    { team: match.team2, players: match.team2_players },
  ]
  return (
    <section>
      <h2 className="sr-only">Elencos</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {sides.map(({ team, players }, i) => (
          <Card key={team?.team_id ?? i} className="overflow-hidden">
            <header className="flex items-center gap-3 border-b border-border bg-primary-soft/60 px-4 py-3">
              <Avatar name={team?.name} size="sm" />
              <h3 className="type-section flex-1 truncate text-ink">{team?.name ?? "A definir"}</h3>
              <Badge>{players.length}</Badge>
            </header>
            {players.length ? (
              <ul className="divide-y divide-border">
                {players.map((p) => (
                  <li key={p.user_id} className="flex items-center gap-3 px-4 py-2.5">
                    <Avatar name={p.name} size="sm" tone="dark" />
                    <span className="type-body-sm truncate text-ink">{p.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="type-body-sm p-4 text-muted-foreground">Elenco não disponível.</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}
