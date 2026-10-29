import { isAxiosError } from "axios"

export type StartFailure = { message: string; ongoingMatchId: string | null }

const GENERIC = "Não foi possível iniciar a partida. Tente novamente."
const ONGOING = /\s*\(partida ([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)/i

const fail = (message: string): StartFailure => ({ message, ongoingMatchId: null })

export function parseStartError(error: unknown): StartFailure {
  if (!isAxiosError(error) || !error.response) return fail(GENERIC)
  const { status, data } = error.response
  if (status === 403) return fail("Você não tem permissão para iniciar partidas.")
  if (status !== 400 || typeof data?.error !== "string" || !data.error) return fail(GENERIC)

  const ongoing = ONGOING.exec(data.error)
  return { message: data.error.replace(ONGOING, ""), ongoingMatchId: ongoing?.[1] ?? null }
}
