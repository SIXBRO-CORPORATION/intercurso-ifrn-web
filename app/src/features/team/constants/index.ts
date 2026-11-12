import type { TeamStatus } from "../schemas/team-schema"

export const TEAM_NAME_MIN = 3
export const TEAM_NAME_MAX = 60
export const TEAM_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const TEAM_PHOTO_TYPES: readonly string[] = ["image/png", "image/jpeg", "image/webp"]
export const TEAM_INVITE_PATH = "/convite"

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