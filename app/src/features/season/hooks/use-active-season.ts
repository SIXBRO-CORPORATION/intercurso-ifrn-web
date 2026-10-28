"use client"

import { useQuery } from "@tanstack/react-query"
import { getActiveSeason } from "../repositories/season-repository"

export function useActiveSeason() {
  return useQuery({
    queryKey: ["season", "active"],
    queryFn: ({ signal }) => getActiveSeason(signal),
  })
}
