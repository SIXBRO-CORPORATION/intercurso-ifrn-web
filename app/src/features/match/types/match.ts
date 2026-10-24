import type { MatchStatus } from "../schemas/match-schema"

export type { Match, MatchDetail, MatchPage, MatchStatus, MatchTeam } from "../schemas/match-schema"

export type MatchFilters = {
  season_id: string
  modality_id: string
  status: MatchStatus | ""
  date_from: string
  date_to: string
  page: number
  size: number
}
