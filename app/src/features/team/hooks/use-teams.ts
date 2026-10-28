"use client"

import { useCallback } from "react"
import { useRequest } from "@/shared/hooks/use-request"
import { listTeams, type TeamFilters } from "../repositories/team-repository"

export function useTeams({ modalityId, seasonId, status }: TeamFilters) {
    const load = useCallback(
        (signal: AbortSignal) => listTeams({ modalityId, seasonId, status }, signal),
        [modalityId, seasonId, status],
    )
    return useRequest(`teams:${modalityId ?? ""}:${seasonId ?? ""}:${status ?? ""}`, load)
}
