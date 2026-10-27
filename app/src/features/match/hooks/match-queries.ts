import { queryOptions } from "@tanstack/react-query"
import { matchKeys } from "../constants/query-keys"
import { getMatch } from "../repositories/match-repository"

export const matchDetailOptions = (id: string) =>
  queryOptions({
    queryKey: matchKeys.detail(id),
    queryFn: ({ signal }) => getMatch(id, signal),
  })
