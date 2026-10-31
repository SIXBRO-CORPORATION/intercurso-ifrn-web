import { isAxiosError } from "axios"
import { MATCH_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { matchDetailResponseSchema, matchListSchema } from "../schemas/match-schema"
import { toApiQuery } from "../utils/match-filters"

export async function listMatches(query: URLSearchParams, signal: AbortSignal) {
  const { data } = await api.get(MATCH_API, { params: toApiQuery(query), signal })
  return matchListSchema.parse(data).data
}

export async function startMatch(id: string) {
  const { data } = await api.post(`${MATCH_API}${encodeURIComponent(id)}/start`)
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
