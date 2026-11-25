import { MODALITY_ADMIN_API, MODALITY_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { modalityListSchema } from "../schemas/modality-schema"

export async function listModalities(seasonId: string | undefined, signal: AbortSignal) {
  const { data } = await api.get(MODALITY_API, {
    params: seasonId ? { season_id: seasonId } : undefined,
    signal,
  })
  return modalityListSchema.parse(data).data ?? []
}

export async function listAllModalities(signal: AbortSignal) {
  const { data } = await api.get(MODALITY_ADMIN_API, { signal })
  return modalityListSchema.parse(data).data ?? []
}
