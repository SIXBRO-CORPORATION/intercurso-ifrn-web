import type { TeamSummary } from "../schemas/team-schema"

export function getTeamCountLabel(members: number, max: number | null | undefined) {
    const label = members === 1 ? "integrante" : "integrantes"
    return max ? `${members}/${max} ${label}` : `${members} ${label}`
}

export function getTeamRoleLabel(team: Pick<TeamSummary, "owner_id" | "captain_id">, userId: string | undefined) {
    if (userId && team.owner_id === userId) return "Dono"
    if (userId && team.captain_id === userId) return "Capitão"
    return "Membro"
}