"use client"

import { useQueryClient, noop } from "@tanstack/react-query"
import { matchDetailOptions } from "./match-queries"

export function usePrefetchMatch() {
  const queryClient = useQueryClient()

  return (id: string) => {
    void queryClient.query(matchDetailOptions(id)).catch(noop)
  }
}