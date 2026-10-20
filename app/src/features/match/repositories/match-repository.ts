import { MATCH_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { matchListSchema } from "../schemas/match-schema"

export async function listMatches(query: URLSearchParams, signal: AbortSignal) {
  const { data } = await api.get(MATCH_API, { params: query, signal })
  return matchListSchema.parse(data).data
}
