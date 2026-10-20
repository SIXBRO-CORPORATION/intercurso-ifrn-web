import type { MatchStatus } from "../types/match"

export const PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100

export const STATUS_OPTIONS: { value: MatchStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Agendado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "FINISHED", label: "Finalizado" },
]
