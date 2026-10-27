"use client"

import { useCallback } from "react"
import { listModalityTeams } from "../repositories/modality-teams-repository"
import { useRequest } from "./use-request"

export function useModalityTeams(modalityId: string, seasonId?: string) {
  const load = useCallback(
    (signal: AbortSignal) => listModalityTeams(modalityId, seasonId, signal),
    [modalityId, seasonId],
  )
  return useRequest(`teams:${modalityId}:${seasonId ?? "all"}`, load)
}
