import type { MatchDetail, MatchTeam } from "../types/match"
import { isVolleyMatch } from "./match-card"

const KICK_EVENTS: Record<string, boolean> = { PENALTY_GOAL: true, PENALTY_MISS: false }

export const MIN_KICK_SLOTS = 5

export function isTiedMatch(match: Pick<MatchDetail, "team1" | "team2">) {
  const { team1, team2 } = match
  if (!team1 || !team2 || isVolleyMatch(match)) return false
  return team1.score === team2.score
}

export function isKnockoutTie(match: Pick<MatchDetail, "team1" | "team2" | "match_category">) {
  return match.match_category === "KNOCKOUT" && isTiedMatch(match)
}

export function isGroupTie(match: Pick<MatchDetail, "team1" | "team2" | "match_category">) {
  return match.match_category === "GROUP" && isTiedMatch(match)
}

export function hasShootout({ team1, team2 }: Pick<MatchDetail, "team1" | "team2">) {
  return team1?.penalty_score != null && team2?.penalty_score != null
}

export function withPenalties(score: number | string,team: MatchTeam | null, shootout: boolean) {
  return shootout ? `${score}(${team?.penalty_score ?? 0})` : String(score)
}

export function penaltyWinner({ team1, team2 }: Pick<MatchDetail, "team1" | "team2">) {
  if (!team1 || !team2) return null
  const a = team1.penalty_score ?? 0
  const b = team2.penalty_score ?? 0
  if (a === b) return null
  return a > b ? team1 : team2
}

export function penaltyKicks(match: MatchDetail) {
  const teams = new Map<string, string>()
  for (const t of [match.team1, match.team2]) if (t) teams.set(t.team_id, t.name)
  const players = new Map([...match.team1_players, ...match.team2_players].map((p) => [p.user_id, p.name]))
  const taken = new Map<string, number>()

  return match.timeline.flatMap((e) => {
    if (!(e.event_type in KICK_EVENTS)) return []
    const teamId = e.team_id ?? ""
    const order = (taken.get(teamId) ?? 0) + 1
    taken.set(teamId, order)
    return [{
      id: e.event_id,
      teamId,
      team: teams.get(teamId) ?? null,
      player: (e.player_id && players.get(e.player_id)) || null,
      scored: KICK_EVENTS[e.event_type],
      order,
    }]
  })
}

export function kickResults(kicks: ReturnType<typeof penaltyKicks>, teamId: string) {
  return kicks.filter((k) => k.teamId === teamId).map((k) => k.scored)
}
