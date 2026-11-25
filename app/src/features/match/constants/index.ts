import { CircleDot, CircleX, Flag, Pause, Play, Plus, Square, UserX, type LucideIcon } from "lucide-react"
import type { MatchStatus } from "../types/match"

export const PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100
export const MATCH_EVENT_NAMES = [
  "match_started",
  "score_update",
  "clock_update",
  "card_issued",
  "period_started",
  "period_ended",
  "set_finished",
  "event_deleted",
  "match_finished",
]

export const STATUS_OPTIONS: { value: MatchStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Agendado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "FINISHED", label: "Finalizado" },
]

export const EVENT_TYPES: Record<string, { label: string; icon: LucideIcon; className?: string }> = {
  MATCH_STARTED: { label: "Início da partida", icon: Play },
  MATCH_END: { label: "Fim da partida", icon: Flag },
  PERIOD_START: { label: "Início do período", icon: Play },
  PERIOD_END: { label: "Fim do período", icon: Pause },
  SET_END: { label: "Fim do set", icon: Flag },
  GOAL: { label: "Gol", icon: CircleDot, className: "text-primary-text" },
  POINT: { label: "Ponto", icon: Plus, className: "text-primary-text" },
  PENALTY_GOAL: { label: "Pênalti convertido", icon: CircleDot, className: "text-primary-text" },
  PENALTY_MISS: { label: "Pênalti perdido", icon: CircleX, className: "text-muted-foreground" },
  CARD_YELLOW: { label: "Cartão amarelo", icon: Square, className: "fill-card-yellow text-card-yellow" },
  CARD_RED: { label: "Cartão vermelho", icon: Square, className: "fill-card-red text-card-red" },
  EXPULSION: { label: "Expulsão", icon: UserX, className: "text-card-red" },
}

export const SCORE_TYPE_LABELS: Record<string, string> = { GOALS: "Gols", POINTS: "Pontos", SETS: "Sets" }
