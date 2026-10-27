"use client"

import { useCallback } from "react"
import { listModalities } from "../repositories/modality-repository"
import { useRequest } from "./use-request"

export function useModalities(seasonId?: string) {
  const load = useCallback((signal: AbortSignal) => listModalities(seasonId, signal), [seasonId])
  return useRequest(`modalities:${seasonId ?? "all"}`, load)
}
