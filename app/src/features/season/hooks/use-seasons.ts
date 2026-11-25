"use client"

import { useQuery } from "@tanstack/react-query"
import { getSeason, listSeasons } from "../repositories/season-repository"

export function useSeasons() {
  return useQuery({ queryKey: ["season", "list"], queryFn: ({ signal }) => listSeasons(signal) })
}

export function useSeason(id: string) {
  return useQuery({ queryKey: ["season", "detail", id], queryFn: ({ signal }) => getSeason(id, signal) })
}
