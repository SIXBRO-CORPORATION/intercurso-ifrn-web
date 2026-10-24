"use client"

import { useCallback, useEffect, useState } from "react"
import { getMatch } from "../repositories/match-repository"
import type { MatchDetail } from "../types/match"

type Result = { key: string; match: MatchDetail | null } | { key: string; failed: true }

export function useMatch(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${attempt}:${id}`

  useEffect(() => {
    const controller = new AbortController()
    getMatch(id, controller.signal).then(
      (match) => setResult({ key, match }),
      () => {
        if (!controller.signal.aborted) setResult({ key, failed: true })
      },
    )
    return () => controller.abort()
  }, [id, key])

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  if (result?.key !== key) return { status: "loading", refetch } as const
  if ("failed" in result) return { status: "error", refetch } as const
  if (!result.match) return { status: "not-found", refetch } as const
  return { status: "success", match: result.match, refetch } as const
}
