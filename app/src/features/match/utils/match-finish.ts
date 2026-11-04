import type { MatchDetail } from "../types/match"
import { isVolleyMatch } from "./match-card"

export function finishResult({ team1, team2 }: Pick<MatchDetail, "team1" | "team2">) {
  if (!team1 || !team2) return null
  const sets = isVolleyMatch({ team1 })
  const score1 = sets ? (team1.sets_won ?? 0) : team1.score
  const score2 = sets ? (team2.sets_won ?? 0) : team2.score
  const winner = score1 === score2 ? null : score1 > score2 ? team1 : team2
  return { team1, team2, score1, score2, winner, sets }
}

export function matchWinnerTeam({ team1, team2, winner_id }: Pick<MatchDetail, "team1" | "team2" | "winner_id">) {
  return [team1, team2].find((team) => team && team.team_id === winner_id) ?? null
}
