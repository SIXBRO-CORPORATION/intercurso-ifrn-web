import { differenceInCalendarDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatBrDate } from "@/lib/iso-date"
import type { Season } from "../schemas/season-schema"

export type RegistrationState = { open: boolean; message: string; detail: string | null }

const NONE: RegistrationState = { open: false, message: "Não há período de inscrições aberto no momento.", detail: null }
const CLOSED: RegistrationState = {
  open: false,
  message: "Período de inscrições encerrado. Aguarde a próxima temporada.",
  detail: null,
}

function parse(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function describe(verb: string, target: Date, now: Date) {
  const days = differenceInCalendarDays(target, now)
  const remaining = days < 1 ? "falta menos de 1 dia" : days === 1 ? "falta 1 dia" : `faltam ${days} dias`
  return `${verb} em ${formatBrDate(target)} às ${format(target, "HH:mm", { locale: ptBR })} · ${remaining}.`
}

export function getRegistrationState(season: Season | null | undefined, now: Date): RegistrationState {
  if (!season || !season.active || season.status === "FINISHED") return NONE
  if (season.status === "REGISTRATION_CLOSED" || season.status === "IN_PROGRESS") return CLOSED

  const start = parse(season.registration_start_date)
  const end = parse(season.registration_end_date)

  if (season.status === "DRAFT" || (start && now < start)) {
    return { ...NONE, detail: start && start > now ? describe("Abrem", start, now) : null }
  }
  if (end && now > end) return CLOSED
  return { open: true, message: "Inscrições abertas", detail: end ? describe("Encerram", end, now) : null }
}
