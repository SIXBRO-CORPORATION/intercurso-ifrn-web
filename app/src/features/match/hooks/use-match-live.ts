"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { RealtimeStatus } from "@/core/realtime/types"
import { connectRealtime } from "@/infrastructure/realtime/realtime-client"
import { MATCH_EVENT_NAMES } from "../constants"
import { matchLiveEventSchema } from "../schemas/match-schema"

const STALE_AFTER_MS = 40_000

export function useMatchLive(id: string, enabled: boolean) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<RealtimeStatus>("connecting")

  useEffect(() => {
    if (!enabled) return
    const key = ["match", id]
    const refetch = () => void queryClient.invalidateQueries({ queryKey: key })

    return connectRealtime({
      channel: { type: "match", id },
      schema: matchLiveEventSchema,
      eventNames: MATCH_EVENT_NAMES,
      staleAfterMs: STALE_AFTER_MS,
      onEvent: ({ match }) => (match ? queryClient.setQueryData(key, match) : refetch()),
      onReconnect: refetch,
      onError: (error) => error.code === "invalid_event" && refetch(),
      onStatus: setStatus,
    })
  }, [id, enabled, queryClient])

  return enabled ? status : "closed"
}
