"use client"

import { useQuery } from "@tanstack/react-query"
import { matchDetailOptions } from "./match-queries"

export function useMatch(id: string) {
  const query = useQuery(matchDetailOptions(id))
  const refetch = () => void query.refetch()

  if (query.data === undefined) {
    return query.isError ? ({ status: "error", refetch } as const) : ({ status: "loading", refetch } as const)
  }
  if (query.data === null) return { status: "not-found", refetch } as const
  return { status: "success", match: query.data, refetch } as const
}
