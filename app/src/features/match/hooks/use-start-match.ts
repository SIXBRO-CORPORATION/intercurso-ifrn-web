"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { startMatch } from "../repositories/match-repository"

export function useStartMatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startMatch,
    onSettled: (_data, _error, id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["matches"] }),
        queryClient.invalidateQueries({ queryKey: ["match", id] }),
      ]),
  })
}
