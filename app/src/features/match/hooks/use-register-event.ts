"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerEvent } from "../repositories/match-repository"
import type { MatchEventAction } from "../types/match"

export function useRegisterEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action: MatchEventAction) => registerEvent(id, action),
    onSuccess: (match) => queryClient.setQueryData(["match", id], match),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["match", id] }),
  })
}
