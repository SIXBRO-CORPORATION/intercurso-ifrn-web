import { EVENT_TYPES } from "../constants"
import type { MatchDetail } from "../types/match"
import { formatClock, isVolleyMatch } from "./match-card"

export function timelineRows(match: MatchDetail) {
  const teams = new Map<string, string>()
  for (const t of [match.team1, match.team2]) if (t) teams.set(t.team_id, t.name)
  const players = new Map([...match.team1_players, ...match.team2_players].map((p) => [p.user_id, p.name]))

  const volley = isVolleyMatch(match)

  let sets = 0
  const rows = match.timeline.flatMap((e) => {
    const type = EVENT_TYPES[e.event_type]
    if (!type) return []
    const label = e.event_type === "SET_END" ? `${type.label} ${++sets}` : type.label
    return [{
      id: e.event_id,
      type,
      label,
      clock: volley ? null : formatClock(e.clock_seconds),
      team: (e.team_id && teams.get(e.team_id)) || null,
      player: (e.player_id && players.get(e.player_id)) || null,
      side: !e.team_id ? null : e.team_id === match.team1?.team_id ? 1 : e.team_id === match.team2?.team_id ? 2 : null,
    }]
  })
  return match.status === "IN_PROGRESS" ? rows.reverse() : rows
}
