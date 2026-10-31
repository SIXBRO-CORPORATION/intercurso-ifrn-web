"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { runMatchAction } from "../repositories/match-repository"
import type { MatchAction } from "../types/match"

export function useMatchAction(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action: MatchAction) => runMatchAction(id, action),
    onSuccess: (match) => queryClient.setQueryData(["match", id], match),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["match", id] }),
  })
}
