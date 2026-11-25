import { formatBrDate } from "@/lib/iso-date"
import type { Season } from "../schemas/season-schema"

const format = (value: string | null | undefined) => {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? formatBrDate(date) : null
}

export function getRegistrationPeriodLabel(season: Pick<Season, "registration_start_date" | "registration_end_date">) {
  const start = format(season.registration_start_date)
  const end = format(season.registration_end_date)
  if (!start && !end) return "Inscrições sem período definido"
  return `Inscrições: ${start ?? "—"} a ${end ?? "—"}`
}
