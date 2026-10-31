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
    }]
  })
  return match.status === "IN_PROGRESS" ? rows.reverse() : rows
}

export function playerCards(timeline: MatchDetail["timeline"]) {
  const cards = new Map<string, { yellow: number; red: boolean }>()
  for (const e of timeline) {
    if (!e.player_id) continue
    const card = cards.get(e.player_id) ?? { yellow: 0, red: false }
    if (e.event_type === "CARD_YELLOW") card.yellow++
    if (e.event_type === "CARD_RED" || e.event_type === "EXPULSION") card.red = true
    cards.set(e.player_id, card)
  }
  return cards
}
