"use client"

import { useQuery } from "@tanstack/react-query"
import { listTeams, type TeamFilters } from "../repositories/team-repository"

export function useTeams({ modalityId, seasonId, status }: TeamFilters) {
    return useQuery({
        queryKey: ["teams", { modalityId, seasonId, status }],
        queryFn: ({ signal }) => listTeams({ modalityId, seasonId, status }, signal),
    })
}
