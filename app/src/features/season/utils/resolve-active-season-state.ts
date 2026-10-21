import type { ActiveSeasonOutcome, ActiveSeasonState } from "../types/season"

export type ActiveSeasonResult = { attempt: number; outcome: ActiveSeasonOutcome }

// Enquanto o resultado guardado não for da tentativa atual, a tela está carregando.
export function resolveActiveSeasonState(
  result: ActiveSeasonResult | null,
  attempt: number,
): ActiveSeasonState {
  return result && result.attempt === attempt
    ? result.outcome
    : { kind: "loading" }
}
