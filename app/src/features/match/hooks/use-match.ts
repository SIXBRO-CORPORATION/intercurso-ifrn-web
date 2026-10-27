"use client"

import { useCallback, useEffect, useState } from "react"
import { getMatch } from "../repositories/match-repository"
import type { MatchDetail } from "../types/match"
import { useMatchLive } from "./use-match-live"

type Result = { key: string; match: MatchDetail | null } | { key: string; failed: true }

export function useMatch(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [live, setLive] = useState<{ id: string; match: MatchDetail } | null>(null)
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

  const refetch = useCallback(() => {
    setLive(null)
    setAttempt((n) => n + 1)
  }, [])
  const onLive = useCallback((match: MatchDetail) => setLive({ id, match }), [id])

  const base = result?.key === key && "match" in result ? result.match : null
  const match = live?.id === id ? live.match : base
  const connection = useMatchLive(id, match?.status === "IN_PROGRESS", onLive)

  if (result?.key !== key) return { status: "loading", refetch } as const
  if ("failed" in result) return { status: "error", refetch } as const
  if (!match) return { status: "not-found", refetch } as const
  return { status: "success", match, connection, refetch } as const
}
