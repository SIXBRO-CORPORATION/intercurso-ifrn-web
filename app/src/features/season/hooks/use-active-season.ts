"use client"

import { useEffect, useState } from "react"
import { getActiveSeason } from "../repositories/season-repository"
import type { Season } from "../schemas/season-schema"

type Result = { season: Season | null } | { failed: true }

export function useActiveSeason() {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getActiveSeason(controller.signal).then(
      (season) => setResult({ season }),
      () => {
        if (!controller.signal.aborted) setResult({ failed: true })
      },
    )
    return () => controller.abort()
  }, [])

  if (!result) return { status: "loading" } as const
  if ("failed" in result) return { status: "error" } as const
  return { status: "success", season: result.season } as const
}
