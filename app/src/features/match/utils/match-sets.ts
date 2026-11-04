import type { MatchDetail, MatchTeam } from "../types/match"

const SET_POINTS = 25
const DECIDING_SET_POINTS = 15
const MIN_LEAD = 2

type SetsMatch = Pick<MatchDetail, "team1" | "team2" | "sets" | "modality_configuration">

export function currentSetNumber({ sets }: Pick<MatchDetail, "sets">) {
  return sets.length + 1
}

export function setTarget(match: SetsMatch) {
  const toWin = match.modality_configuration?.sets_to_win
  return toWin && currentSetNumber(match) === toWin * 2 - 1 ? DECIDING_SET_POINTS : SET_POINTS
}

export function setSuggestion(match: SetsMatch) {
  const { team1, team2 } = match
  if (!team1 || !team2) return null
  const [winner, loser] = team1.score >= team2.score ? [team1, team2] : [team2, team1]
  if (winner.score < setTarget(match) || winner.score - loser.score < MIN_LEAD) return null
  return { winner, loser, number: currentSetNumber(match) }
}

export function matchWinner({ team1, team2, modality_configuration }: SetsMatch) {
  const toWin = modality_configuration?.sets_to_win
  if (!toWin) return null
  const [winner, loser] = [team1, team2].sort((a, b) => (b?.sets_won ?? 0) - (a?.sets_won ?? 0))
  return winner && (winner.sets_won ?? 0) >= toWin ? { winner, loser: loser as MatchTeam | null } : null
}
