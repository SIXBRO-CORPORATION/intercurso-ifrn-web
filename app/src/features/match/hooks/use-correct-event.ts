"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteEvent, undoLastEvent } from "../repositories/match-repository"

// eventId nulo desfaz o último evento corrigível; com id, exclui aquele evento.
export function useCorrectEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string | null) => (eventId ? deleteEvent(id, eventId) : undoLastEvent(id)),
    onSuccess: (match) => queryClient.setQueryData(["match", id], match),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["match", id] }),
  })
}
