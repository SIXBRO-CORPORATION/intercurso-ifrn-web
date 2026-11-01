"use client"

import { useEffect, useState } from "react"
import { listModalities } from "../repositories/modality-repository"
import type { Modality } from "../schemas/modality-schema"

type Result = { seasonId: string; items: Modality[] } | { seasonId: string; failed: true }

export function useModalities(seasonId: string) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listModalities(seasonId, controller.signal).then(
      (items) => setResult({ seasonId, items }),
      () => {
        if (!controller.signal.aborted) setResult({ seasonId, failed: true })
      },
    )
    return () => controller.abort()
  }, [seasonId])

  if (result?.seasonId !== seasonId) return { status: "loading" } as const
  if ("failed" in result) return { status: "error" } as const
  return { status: "success", items: result.items } as const
}
