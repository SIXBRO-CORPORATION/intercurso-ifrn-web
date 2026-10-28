import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const ISO_FORMAT = "yyyy-MM-dd"

export function parseIsoDate(value: string): Date | undefined {
  if (!ISO_PATTERN.test(value)) return undefined
  const date = parse(value, ISO_FORMAT, new Date())
  return isValid(date) ? date : undefined
}

export function toIsoDate(date: Date) {
  return format(date, ISO_FORMAT)
}

export function formatBrDate(date: Date) {
  return format(date, "P", { locale: ptBR })
}
