import { MODALITY_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { modalityListSchema } from "../schemas/modality-schema"

export async function listModalities(seasonId: string, signal: AbortSignal) {
  const { data } = await api.get(MODALITY_API, { params: { season_id: seasonId }, signal })
  return modalityListSchema.parse(data).data.filter((m) => m.active !== false)
}
