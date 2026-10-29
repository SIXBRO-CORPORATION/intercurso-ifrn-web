import { CircleDot, CircleX, Flag, Pause, Play, Plus, Square, UserX, type LucideIcon } from "lucide-react"
import type { MatchStatus } from "../types/match"

export const PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100
export const MANAGE_PATH = "/dashboard/partidas/gerenciar"

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
  GOAL: { label: "Gol", icon: CircleDot, className: "text-primary" },
  POINT: { label: "Ponto", icon: Plus, className: "text-primary" },
  PENALTY_GOAL: { label: "Pênalti convertido", icon: CircleDot, className: "text-primary" },
  PENALTY_MISS: { label: "Pênalti perdido", icon: CircleX, className: "text-danger" },
  CARD_YELLOW: { label: "Cartão amarelo", icon: Square, className: "fill-warning text-warning" },
  CARD_RED: { label: "Cartão vermelho", icon: Square, className: "fill-danger text-danger" },
  EXPULSION: { label: "Expulsão", icon: UserX, className: "text-danger" },
}
