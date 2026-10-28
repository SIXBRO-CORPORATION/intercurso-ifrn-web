"use client"

import { useQuery } from "@tanstack/react-query"
import { listMatches } from "../repositories/match-repository"
import type { MatchFilters } from "../types/match"
import { toQuery } from "../utils/match-filters"

export function useMatches(filters: MatchFilters) {
  const query = toQuery(filters).toString()

  return useQuery({
    queryKey: ["matches", query],
    queryFn: ({ signal }) => listMatches(new URLSearchParams(query), signal),
  })
}
