import type { MatchFilters } from "@/features/match/types/match"

// Prévia da home: os 3 jogos mais próximos da temporada ativa.
export const HOME_MATCHES_FILTERS: MatchFilters = {
  season_id: "",
  modality_id: "",
  status: "",
  date_from: "",
  date_to: "",
  page: 1,
  size: 3,
}
