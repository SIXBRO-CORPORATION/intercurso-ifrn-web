import { EVENT_TYPES } from "../constants"
import type { MatchDetail } from "../types/match"

// Jogador fora do elenco da partida (ex.: saiu do time depois do evento) não quebra a linha:
// mostra só o time.
export function timelineRows(match: MatchDetail) {
  const teams = new Map<string, string>()
  for (const t of [match.team1, match.team2]) if (t) teams.set(t.team_id, t.name)
  const players = new Map([...match.team1_players, ...match.team2_players].map((p) => [p.user_id, p.name]))

  let sets = 0
  const rows = match.timeline.flatMap((e) => {
    const type = EVENT_TYPES[e.event_type]
    if (!type) return []
    const label = e.event_type === "SET_END" ? `${type.label} ${++sets}` : type.label
    return [{
      id: e.event_id,
      type,
      label,
      minute: Math.floor(e.clock_seconds / 60),
      team: (e.team_id && teams.get(e.team_id)) || null,
      player: (e.player_id && players.get(e.player_id)) || null,
    }]
  })
  // Ao vivo: mais recente primeiro; depois do jogo: ordem cronológica.
  return match.status === "IN_PROGRESS" ? rows.reverse() : rows
}
