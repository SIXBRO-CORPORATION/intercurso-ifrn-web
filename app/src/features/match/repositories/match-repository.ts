import { isAxiosError } from "axios"
import { MATCH_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { matchDetailResponseSchema, matchListSchema } from "../schemas/match-schema"
import type { MatchAction, MatchEventAction, PenaltyKickAction } from "../types/match"
import { toApiQuery } from "../utils/match-filters"

export async function listMatches(query: URLSearchParams, signal: AbortSignal) {
  const { data } = await api.get(MATCH_API, { params: toApiQuery(query), signal })
  return matchListSchema.parse(data).data
}

export async function startMatch(id: string) {
  const { data } = await api.post(`${MATCH_API}${encodeURIComponent(id)}/start`)
  return matchDetailResponseSchema.parse(data).data
}

export async function registerEvent(id: string, { kind, team_id, player_id }: MatchEventAction) {
  const isGoal = kind === "GOAL"
  const { data } = await api.post(
    `${MATCH_API}${encodeURIComponent(id)}/${isGoal ? "goal" : "card"}`,
    isGoal ? { team_id, player_id } : { team_id, player_id, card_type: kind },
  )
  return matchDetailResponseSchema.parse(data).data
}

export async function registerPenaltyKick(id: string, kick: PenaltyKickAction) {
  const { data } = await api.post(`${MATCH_API}${encodeURIComponent(id)}/penalty-shootout/kick`, kick)
  return matchDetailResponseSchema.parse(data).data
}

export async function undoLastEvent(id: string) {
  const { data } = await api.post(`${MATCH_API}${encodeURIComponent(id)}/event/undo`)
  return matchDetailResponseSchema.parse(data).data
}

export async function deleteEvent(id: string, eventId: string) {
  const { data } = await api.delete(`${MATCH_API}${encodeURIComponent(id)}/event/${encodeURIComponent(eventId)}`)
  return matchDetailResponseSchema.parse(data).data
}

export async function runMatchAction(id: string, action: MatchAction) {
  const { data } = await api.post(`${MATCH_API}${encodeURIComponent(id)}/${action}`)
  return matchDetailResponseSchema.parse(data).data
}

export async function getMatch(id: string, signal: AbortSignal) {
  try {
    const { data } = await api.get(`${MATCH_API}${encodeURIComponent(id)}`, { signal })
    return matchDetailResponseSchema.parse(data).data
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 422)) return null
    throw error
  }
}
