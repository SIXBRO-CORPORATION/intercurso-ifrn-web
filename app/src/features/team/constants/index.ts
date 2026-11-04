import type { TeamStatus } from "../schemas/team-schema"

export const NEW_TEAM_PATH = "/equipes/nova"

export const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
    DRAFT: "Rascunho",
    SUBMITTED: "Aguardando aprovação",
    APPROVED: "Aprovada",
    REJECTED: "Rejeitada",
}

export const TEAM_STATUS_VARIANTS = {
    DRAFT: "neutral",
    SUBMITTED: "warning",
    APPROVED: "success",
    REJECTED: "danger",
} as const satisfies Record<TeamStatus, "neutral" | "warning" | "success" | "danger">