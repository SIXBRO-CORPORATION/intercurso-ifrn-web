import type { Season } from "../schemas/season-schema"

export const SEASON_STATUS_BADGES = {
  DRAFT: { label: "Rascunho", variant: "neutral" },
  REGISTRATION_OPEN: { label: "Inscrições abertas", variant: "success" },
  REGISTRATION_CLOSED: { label: "Inscrições encerradas", variant: "warning" },
  IN_PROGRESS: { label: "Em andamento", variant: "success" },
  FINISHED: { label: "Finalizada", variant: "neutral" },
} as const satisfies Record<Season["status"], { label: string; variant: string }>
