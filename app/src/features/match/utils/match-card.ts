import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Match } from "../types/match"

const dateOnly = /^\d{4}-\d{2}-\d{2}$/

export function formatScheduledDate(iso: string | null) {
  if (!iso) return null
  const date = parseISO(iso)
  if (!isValid(date)) return null
  return format(date, dateOnly.test(iso) ? "P" : "Pp", { locale: ptBR })
}

export function periodLabel(period: number | null) {
  return period ? `${period}º período` : null
}

export function phaseLabel(match: Pick<Match, "group_name" | "match_type">) {
  return match.group_name ?? match.match_type
}

const ROUND_LABELS: Record<string, string> = {
  SEMIFINAL: "Semifinal",
  FINAL: "Final",
  THIRD_PLACE: "Disputa de 3º lugar",
}

const STAGE_LABELS: Record<string, string> = {
  GROUP: "Fase de grupos",
  KNOCKOUT: "Mata-mata",
}

export function roundLabel(match: Pick<Match, "match_type">) {
  return (match.match_type && ROUND_LABELS[match.match_type]) || null
}

export function stageLabel(match: Pick<Match, "group_name" | "match_category">) {
  return match.group_name ?? ((match.match_category && STAGE_LABELS[match.match_category]) || null)
}

export function formatScheduledSlot(iso: string | null) {
  if (!iso) return null
  const date = parseISO(iso)
  if (!isValid(date)) return null
  return {
    date: format(date, "dd/MM", { locale: ptBR }),
    time: dateOnly.test(iso) ? null : format(date, "HH:mm"),
  }
}

export function teamsLabel(match: Pick<Match, "team1" | "team2">) {
  return `${match.team1?.name ?? "A definir"} × ${match.team2?.name ?? "A definir"}`
}

export function isVolleyMatch(match: Pick<Match, "team1">) {
  return match.team1?.sets_won != null
}

export function formatClock(seconds: number | null) {
  const total = Math.max(0, Math.floor(seconds ?? 0))
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}
