"use client"

import { useActiveSeason } from "../hooks/use-active-season"
import { ActiveSeasonView } from "./active-season-view"

export function ActiveSeasonCard() {
  const { state, retry } = useActiveSeason()
  return <ActiveSeasonView state={state} onRetry={retry} />
}
