"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerPenaltyKick } from "../repositories/match-repository"
import type { PenaltyKickAction } from "../types/match"

export function usePenaltyKick(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (kick: PenaltyKickAction) => registerPenaltyKick(id, kick),
    onSuccess: (match) => queryClient.setQueryData(["match", id], match),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["match", id] }),
  })
}
