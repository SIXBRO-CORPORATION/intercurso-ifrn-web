"use client"

import { useEffect, useState } from "react"
import { listMatches } from "../repositories/match-repository"
import type { MatchFilters, MatchPage } from "../types/match"
import { toQuery } from "../utils/match-filters"

type Result = { key: string; page: MatchPage } | { key: string; failed: true }

export function useMatches(filters: MatchFilters) {
  const key = toQuery(filters).toString()
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listMatches(new URLSearchParams(key), controller.signal).then(
      (page) => setResult({ key, page }),
      () => {
        if (!controller.signal.aborted) setResult({ key, failed: true })
      },
    )
    return () => controller.abort()
  }, [key])

  if (result?.key !== key) return { status: "loading" } as const
  if ("failed" in result) return { status: "error" } as const
  return { status: "success", page: result.page } as const
}
