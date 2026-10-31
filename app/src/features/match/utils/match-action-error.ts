import { isAxiosError } from "axios"

const GENERIC = "Não foi possível executar a ação. Tente novamente."

export function parseMatchActionError(error: unknown) {
  if (!isAxiosError(error) || !error.response) return GENERIC
  const { status, data } = error.response
  if (status === 403) return "Você não tem permissão para controlar esta partida."
  if (status === 400 && typeof data?.error === "string" && data.error) return data.error
  return GENERIC
}
