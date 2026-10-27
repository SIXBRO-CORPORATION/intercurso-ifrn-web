import { MODALITY_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { modalityListSchema } from "../schemas/modality-schema"

export async function listModalities(seasonId: string | undefined, signal: AbortSignal) {
  const { data } = await api.get(MODALITY_API, {
    params: seasonId ? { season_id: seasonId } : undefined,
    signal,
  })
  return (modalityListSchema.parse(data).data ?? []).filter((modality) => modality.active)
}
