import type { SeasonStatus } from "../schemas/season-schema"

export const SEASON_STATUS_LABEL: Record<SeasonStatus, string> = {
  DRAFT: "Rascunho",
  REGISTRATION_OPEN: "Inscrições abertas",
  REGISTRATION_CLOSED: "Inscrições encerradas",
  IN_PROGRESS: "Em andamento",
  FINISHED: "Finalizada",
}
