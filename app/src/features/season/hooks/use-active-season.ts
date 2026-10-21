"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchActiveSeason } from "../services/season-service"
import {
  resolveActiveSeasonState,
  type ActiveSeasonResult,
} from "../utils/resolve-active-season-state"

export function useActiveSeason() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<ActiveSeasonResult | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    void fetchActiveSeason(controller.signal).then((outcome) => {
      if (!cancelled) setResult({ attempt, outcome })
    })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  return { state: resolveActiveSeasonState(result, attempt), retry }
}
