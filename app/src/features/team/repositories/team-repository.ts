import { TEAM_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { teamListSchema, type TeamStatus } from "../schemas/team-schema"

export type TeamFilters = { modalityId?: string; seasonId?: string; status?: TeamStatus }

export async function listTeams({ modalityId, seasonId, status }: TeamFilters, signal: AbortSignal) {
    const params: Record<string, string> = {}
    if (modalityId) params.modality_id = modalityId
    if (seasonId) params.season_id = seasonId
    if (status) params.status = status
    const { data } = await api.get(TEAM_API, { params, signal })
    return teamListSchema.parse(data).data ?? []
}
