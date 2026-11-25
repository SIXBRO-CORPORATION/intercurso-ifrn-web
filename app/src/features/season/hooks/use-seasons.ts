"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createSeason, getSeason, listSeasons } from "../repositories/season-repository"

export function useSeasons() {
  return useQuery({ queryKey: ["season", "list"], queryFn: ({ signal }) => listSeasons(signal) })
}

export function useSeason(id: string) {
  return useQuery({ queryKey: ["season", "detail", id], queryFn: ({ signal }) => getSeason(id, signal) })
}

export function useCreateSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSeason,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["season"] }),
  })
}
