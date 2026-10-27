"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { matchKeys } from "../constants/query-keys"
import { listMatches } from "../repositories/match-repository"
import type { MatchFilters } from "../types/match"
import { toQuery } from "../utils/match-filters"

export function useMatches(filters: MatchFilters) {
  const key = toQuery(filters).toString()
  const query = useQuery({
    queryKey: matchKeys.list(key),
    queryFn: ({ signal }) => listMatches(new URLSearchParams(key), signal),
    placeholderData: keepPreviousData,
  })
  const refetch = () => void query.refetch()

  if (!query.data) {
    return query.isError ? ({ status: "error", refetch } as const) : ({ status: "loading" } as const)
  }
  return { status: "success", page: query.data, stale: query.isPlaceholderData } as const
}
