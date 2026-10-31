import type { MatchStatus } from "../schemas/match-schema"

export type { Match, MatchDetail, MatchPage, MatchPlayer, MatchStatus, MatchTeam } from "../schemas/match-schema"

export type MatchEventKind = "GOAL" | "YELLOW" | "RED"

export type MatchEventAction = { kind: MatchEventKind; team_id: string; player_id: string }

export type MatchFilters = {
  season_id: string
  modality_id: string
  status: MatchStatus | ""
  date_from: string
  date_to: string
  page: number
  size: number
}

export type MatchAction = "clock/pause" | "clock/resume" | "period/end" | "period/start"
