"use client"

import { useQuery } from "@tanstack/react-query"
import { getActiveSeason } from "../repositories/season-repository"

const FIVE_MINUTES = 5 * 60_000

export function useActiveSeason() {
  const query = useQuery({
    queryKey: ["season", "active"],
    queryFn: ({ signal }) => getActiveSeason(signal),
    staleTime: FIVE_MINUTES,
  })

  if (query.data === undefined) return query.isError ? ({ status: "error" } as const) : ({ status: "loading" } as const)
  return { status: "success", season: query.data } as const
}
