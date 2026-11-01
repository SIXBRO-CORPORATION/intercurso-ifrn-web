import type { SeasonStatus } from "../schemas/season-schema"

export const SEASON_STATUS: Record<SeasonStatus, { label: string; variant: "neutral" | "success" | "warning" | "dark" }> = {
  DRAFT: { label: "Rascunho", variant: "neutral" },
  REGISTRATION_OPEN: { label: "Inscrições abertas", variant: "success" },
  REGISTRATION_CLOSED: { label: "Inscrições encerradas", variant: "warning" },
  IN_PROGRESS: { label: "Em andamento", variant: "success" },
  FINISHED: { label: "Finalizada", variant: "dark" },
}
