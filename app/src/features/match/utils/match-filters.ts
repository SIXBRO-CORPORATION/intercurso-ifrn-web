import { MAX_PAGE_SIZE, PAGE_SIZE, STATUS_OPTIONS } from "../constants"
import type { MatchFilters, MatchStatus } from "../types/match"

function positiveInt(raw: string | null, fallback: number, max: number) {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback
}

export function parseFilters(params: URLSearchParams): MatchFilters {
  const status = params.get("status")
  return {
    season_id: params.get("season_id") ?? "",
    modality_id: params.get("modality_id") ?? "",
    status: STATUS_OPTIONS.some((o) => o.value === status) ? (status as MatchStatus) : "",
    date_from: params.get("date_from") ?? "",
    date_to: params.get("date_to") ?? "",
    page: positiveInt(params.get("page"), 1, Number.MAX_SAFE_INTEGER),
    size: positiveInt(params.get("size"), PAGE_SIZE, MAX_PAGE_SIZE),
  }
}

export function toQuery(filters: MatchFilters, compact = false) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value === "") continue
    if (compact && ((key === "page" && value === 1) || (key === "size" && value === PAGE_SIZE))) continue
    query.set(key, String(value))
  }
  return query
}
