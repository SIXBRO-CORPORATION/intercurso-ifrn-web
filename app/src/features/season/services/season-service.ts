import { apiFetch } from "@/infrastructure/http/api-client"
import { ACTIVE_SEASON_ENDPOINT } from "../constants"
import type { ActiveSeason, ActiveSeasonOutcome } from "../types/season"

type Envelope = { data?: unknown; code?: string | null }

function toDate(value: unknown): Date | null {
  if (typeof value !== "string") return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

// Valida o payload na borda antes de transformá-lo no modelo interno.
export function parseActiveSeason(data: unknown): ActiveSeason | null {
  if (typeof data !== "object" || data === null) return null
  const raw = data as Record<string, unknown>

  if (
    typeof raw.season_id !== "string" ||
    typeof raw.name !== "string" ||
    typeof raw.year !== "number" ||
    typeof raw.status !== "string"
  ) {
    return null
  }

  return {
    id: raw.season_id,
    name: raw.name,
    year: raw.year,
    status: raw.status,
    registrationStartDate: toDate(raw.registration_start_date),
    registrationEndDate: toDate(raw.registration_end_date),
  }
}

async function readEnvelope(response: Response): Promise<Envelope | null> {
  try {
    return (await response.json()) as Envelope
  } catch {
    return null
  }
}

// GET /api/season/active é público (ADR 0004). Sem temporada ativa o backend
// responde 404 com code NOT_FOUND; qualquer outra falha é erro de verdade.
export async function fetchActiveSeason(
  signal?: AbortSignal,
): Promise<ActiveSeasonOutcome> {
  try {
    const response = await apiFetch(ACTIVE_SEASON_ENDPOINT, { signal })
    const body = await readEnvelope(response)

    if (response.ok) {
      const season = parseActiveSeason(body?.data)
      return season ? { kind: "success", season } : { kind: "error" }
    }

    if (response.status === 404 && body?.code === "NOT_FOUND") {
      return { kind: "none" }
    }

    return { kind: "error" }
  } catch {
    return { kind: "error" }
  }
}
