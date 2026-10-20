import { ACTIVE_SEASON_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { activeSeasonsSchema, type Season } from "../schemas/season-schema"

export async function listActiveSeasons(signal: AbortSignal): Promise<Season[]> {
  const { data } = await api.get(ACTIVE_SEASON_API, { signal })
  return activeSeasonsSchema.parse(data)
}