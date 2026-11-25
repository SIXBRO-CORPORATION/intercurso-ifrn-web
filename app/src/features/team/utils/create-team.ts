import { isAxiosError } from "axios"
import { TEAM_INVITE_PATH, TEAM_PHOTO_MAX_BYTES, TEAM_PHOTO_TYPES } from "../constants"

const GENERIC = "Não foi possível criar a equipe. Tente novamente."

export function validateTeamPhoto(file: Pick<File, "type" | "size">) {
    if (!TEAM_PHOTO_TYPES.includes(file.type)) return "Envie uma imagem PNG, JPG ou WEBP."
    if (file.size > TEAM_PHOTO_MAX_BYTES) return "A foto deve ter no máximo 5 MB."
    return null
}

export function buildInviteUrl(origin: string, token: string) {
    return `${origin}${TEAM_INVITE_PATH}/${encodeURIComponent(token)}`
}

export function parseCreateTeamError(error: unknown) {
    if (!isAxiosError(error) || !error.response) return GENERIC
    const { status, data } = error.response
    if (status === 401 || status === 403) return "Sua sessão expirou. Entre novamente para criar a equipe."
    if (status === 422) return "Confira o nome e a foto da equipe."
    if ((status === 400 || status === 409) && typeof data?.error === "string" && data.error) return data.error
    return GENERIC
}
