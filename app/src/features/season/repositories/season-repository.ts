import { isAxiosError } from "axios"
import { ACTIVE_SEASON_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { activeSeasonSchema } from "../schemas/season-schema"

export async function getActiveSeason(signal: AbortSignal) {
  try {
    const { data } = await api.get(ACTIVE_SEASON_API, { signal })
    return activeSeasonSchema.parse(data).data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}