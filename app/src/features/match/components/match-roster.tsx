import { Avatar } from "@/shared/components/ui/avatar"
import type { MatchDetail } from "../types/match"

export function MatchRoster({ match }: { match: MatchDetail }) {
  const sides = [
    { team: match.team1, players: match.team1_players },
    { team: match.team2, players: match.team2_players },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {sides.map(({ team, players }, i) => (
        <section key={team?.team_id ?? i} className="min-w-0">
          <h2 className="type-h3 flex items-center gap-2 border-b border-border pb-2">
            <Avatar size="xs" name={team?.name} />
            <span className="truncate">{team?.name ?? "A definir"}</span>
          </h2>
          {players.length ? (
            <ul>
              {players.map((p) => (
                <li key={p.user_id} className="type-small flex min-h-8 items-center border-b border-border text-text-secondary">
                  {p.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="type-small pt-2 text-muted-foreground">Elenco não disponível.</p>
          )}
        </section>
      ))}
    </div>
  )
}
