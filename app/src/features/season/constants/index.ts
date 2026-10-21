export const ACTIVE_SEASON_ENDPOINT = "/api/season/active"

// Status vêm do backend em inglês (SeasonStatus); a UI usa os rótulos do mapa de telas.
export const SEASON_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  REGISTRATION_OPEN: "Inscrições Abertas",
  REGISTRATION_CLOSED: "Inscrições Encerradas",
  IN_PROGRESS: "Em Andamento",
  FINISHED: "Finalizada",
}

export const ACTIVE_SEASON_MESSAGES = {
  loading: "Carregando temporada…",
  errorTitle: "Não foi possível carregar a temporada",
  errorDescription: "Verifique sua conexão e tente novamente.",
  retry: "Tentar novamente",
  noneTitle: "Nenhuma temporada ativa no momento",
  noneDescription:
    "Assim que uma temporada começar, os jogos e resultados aparecem aqui.",
} as const
