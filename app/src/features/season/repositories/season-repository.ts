import { isAxiosError } from "axios"
import { ACTIVE_SEASON_API, SEASON_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { activeSeasonSchema, createdSeasonResponseSchema, type CreateSeasonForm, seasonDetailResponseSchema, seasonListSchema } from "../schemas/season-schema"

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

// datetime-local é horário local sem fuso; o backend compara com UTC, então enviamos ISO com fuso.
const toIso = (value: string) => new Date(value).toISOString()

export async function createSeason(form: CreateSeasonForm & { rules_document?: File | null }) {
  const body = new FormData()
  body.append("name", form.name)
  body.append("year", String(form.year))
  for (const id of form.modality_ids) body.append("modality_ids", id)
  body.append("open_immediately", String(form.open_immediately))
  if (!form.open_immediately) body.append("registration_start_date", toIso(form.registration_start_date))
  body.append("registration_end_date", toIso(form.registration_end_date))
  if (form.rules_document) body.append("rules_document", form.rules_document)
  const { data } = await api.post(SEASON_API, body)
  return createdSeasonResponseSchema.parse(data).data
}
