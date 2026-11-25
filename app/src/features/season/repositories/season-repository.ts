import { isAxiosError } from "axios"
import { ACTIVE_SEASON_API, SEASON_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { activeSeasonSchema, seasonDetailResponseSchema, seasonListSchema } from "../schemas/season-schema"

export async function getActiveSeason(signal: AbortSignal) {
  try {
    const { data } = await api.get(ACTIVE_SEASON_API, { signal })
    return activeSeasonSchema.parse(data).data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function listSeasons(signal: AbortSignal) {
  const { data } = await api.get(SEASON_API, { signal })
  return seasonListSchema.parse(data).data ?? []
}

export async function getSeason(id: string, signal: AbortSignal) {
  const { data } = await api.get(`${SEASON_API}${encodeURIComponent(id)}`, { signal })
  return seasonDetailResponseSchema.parse(data).data
}
