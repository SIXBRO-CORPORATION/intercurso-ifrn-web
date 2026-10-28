"use client"

import { useCallback } from "react"
import { useRequest } from "@/shared/hooks/use-request"
import { listModalities } from "../repositories/modality-repository"

export function useModalities(seasonId?: string) {
  const load = useCallback((signal: AbortSignal) => listModalities(seasonId, signal), [seasonId])
  return useRequest(`modalities:${seasonId ?? "all"}`, load)
}
