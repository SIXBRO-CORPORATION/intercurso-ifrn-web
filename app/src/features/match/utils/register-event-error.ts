import { isAxiosError } from "axios"

const GENERIC = "Não foi possível registrar o evento. Tente novamente."

export function parseRegisterEventError(error: unknown) {
  if (!isAxiosError(error) || !error.response) return GENERIC
  const { status, data } = error.response
  if (status === 403) return "Você não tem permissão para registrar eventos."
  if (status === 400 && typeof data?.error === "string" && data.error) return data.error
  return GENERIC
}
