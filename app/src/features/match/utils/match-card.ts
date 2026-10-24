import type { Match } from "../types/match"

const dateOnly = /^\d{4}-\d{2}-\d{2}$/
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" })
const dateAlone = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" })

export function formatScheduledDate(iso: string | null) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return (dateOnly.test(iso) ? dateAlone : dateTime).format(date)
}

export function periodLabel(period: number | null) {
  return period ? `${period}º período` : null
}

export function phaseLabel(match: Pick<Match, "group_name" | "match_type">) {
  return match.group_name ?? match.match_type
}

export function formatClock(seconds: number | null) {
  const total = Math.max(0, Math.floor(seconds ?? 0))
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}
