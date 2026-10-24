"use client"

import { useEffect, useState } from "react"
import { getMatch } from "../repositories/match-repository"
import type { MatchDetail } from "../types/match"

type Result = { id: string; match: MatchDetail | null } | { id: string; failed: true }

export function useMatch(id: string) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getMatch(id, controller.signal).then(
      (match) => setResult({ id, match }),
      () => {
        if (!controller.signal.aborted) setResult({ id, failed: true })
      },
    )
    return () => controller.abort()
  }, [id])

  if (result?.id !== id) return { status: "loading" } as const
  if ("failed" in result) return { status: "error" } as const
  if (!result.match) return { status: "not-found" } as const
  return { status: "success", match: result.match } as const
}
