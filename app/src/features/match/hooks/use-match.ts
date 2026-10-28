"use client"

import { useQuery } from "@tanstack/react-query"
import { getMatch } from "../repositories/match-repository"

export function useMatch(id: string) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: ({ signal }) => getMatch(id, signal),
  })
}
