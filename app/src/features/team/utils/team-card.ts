export function getTeamCountLabel(members: number, max: number | null | undefined) {
    const label = members === 1 ? "integrante" : "integrantes"
    return max ? `${members}/${max} ${label}` : `${members} ${label}`
}
