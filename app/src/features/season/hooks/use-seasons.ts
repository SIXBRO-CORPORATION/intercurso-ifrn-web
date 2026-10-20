"use client"

import { useEffect, useState } from "react"
import { listActiveSeasons } from "../repositories/season-repository"
import type { Season } from "../schemas/season-schema"

type Result = { seasons: Season[] } | { failed: true }

export function useSeasons() {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listActiveSeasons(controller.signal).then(
        (seasons) => setResult({ seasons }),
        () => {
          if (!controller.signal.aborted) setResult({ failed: true })
        },
    )
    return () => controller.abort()
  }, [])

  if (!result) return { status: "loading", seasons: [] as Season[] } as const
  if ("failed" in result) return { status: "error", seasons: [] as Season[] } as const
  return { status: "success", seasons: result.seasons } as const
}