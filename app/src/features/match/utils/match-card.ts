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

export function phaseLabel(match: Pick<Match, "group_name" | "match_type">) {
  return match.group_name ?? match.match_type
}
