import { TEAM_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { modalityTeamListSchema } from "../schemas/modality-team-schema"

export async function listModalityTeams(
    modalityId: string,
    seasonId: string | undefined,
    signal: AbortSignal,
) {
  const params: Record<string, string> = { modality_id: modalityId, status: "APPROVED" }
  if (seasonId) params.season_id = seasonId
  const { data } = await api.get(TEAM_API, { params, signal })
  return modalityTeamListSchema.parse(data).data ?? []
}
