import { EVENT_TYPES } from "../constants"
import type { MatchDetail } from "../types/match"
import { formatClock, isVolleyMatch } from "./match-card"

// Espelha NON_CORRECTABLE_EVENT_TYPES do backend (_correction_shared.py).
const NON_CORRECTABLE = new Set(["MATCH_STARTED", "MATCH_END", "PERIOD_START", "PERIOD_END"])

export const isCorrectable = (event: { event_type: string }) => !NON_CORRECTABLE.has(event.event_type)

// O backend desfaz o evento corrigível mais recente da partida (created_at); sem created_at vale a ordem da lista.
export function lastCorrectableEvent(timeline: MatchDetail["timeline"]) {
  const time = (e: MatchDetail["timeline"][number]) => Date.parse(e.created_at ?? "") || 0
  return timeline.filter(isCorrectable).reduce<MatchDetail["timeline"][number] | undefined>((a, b) => (!a || time(b) >= time(a) ? b : a), undefined)
}

export const rowSummary = ({ label, player, clock }: { label: string; player: string | null; clock: string | null }) =>
  [label, player, clock].filter(Boolean).join(" · ")

export function timelineRows(match: MatchDetail) {
  const teams = new Map<string, string>()
  for (const t of [match.team1, match.team2]) if (t) teams.set(t.team_id, t.name)
  const players = new Map([...match.team1_players, ...match.team2_players].map((p) => [p.user_id, p.name]))

  const volley = isVolleyMatch(match)

  let sets = 0
  const rows = match.timeline.flatMap((e) => {
    const type = EVENT_TYPES[e.event_type]
    if (!type) return []
    const label = e.event_type === "SET_END" ? `${type.label} ${++sets}` : type.label
    return [{
      id: e.event_id,
      correctable: isCorrectable(e),
      type,
      label,
      clock: volley ? null : formatClock(e.clock_seconds),
      team: (e.team_id && teams.get(e.team_id)) || null,
      player: (e.player_id && players.get(e.player_id)) || null,
    }]
  })
  return match.status === "IN_PROGRESS" ? rows.reverse() : rows
}

export function playerCards(timeline: MatchDetail["timeline"]) {
  const cards = new Map<string, { yellow: number; expelled: boolean }>()
  for (const e of timeline) {
    if (!e.player_id) continue
    const card = cards.get(e.player_id) ?? { yellow: 0, expelled: false }
    if (e.event_type === "CARD_YELLOW") card.yellow++
    // Como no backend, só o evento EXPULSION expulsa: o cartão vermelho vem acompanhado dele e, ao desfazer, sobra sozinho.
    if (e.event_type === "EXPULSION") card.expelled = true
    cards.set(e.player_id, card)
  }
  return cards
}

const PERIOD_MARKERS = new Set(["MATCH_STARTED", "PERIOD_START", "PERIOD_END"])

export function isPeriodEnded(timeline: MatchDetail["timeline"]) {
  return timeline.findLast((e) => PERIOD_MARKERS.has(e.event_type))?.event_type === "PERIOD_END"
}

export function hasNextPeriod({ timeline, modality_configuration }: Pick<MatchDetail, "timeline" | "modality_configuration">) {
  const total = modality_configuration?.num_periods
  return !total || timeline.filter((e) => e.event_type === "PERIOD_END").length < total
}
