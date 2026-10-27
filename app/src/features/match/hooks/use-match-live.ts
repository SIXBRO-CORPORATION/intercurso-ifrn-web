"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import type { RealtimeStatus } from "@/core/realtime/types"
import { connectRealtime } from "@/infrastructure/realtime/realtime-client"
import { getMatch } from "../repositories/match-repository"
import { matchDetailSchema } from "../schemas/match-schema"
import type { MatchDetail } from "../types/match"

const EVENT_NAMES = [
  "match_started",
  "score_update",
  "clock_update",
  "card_issued",
  "period_started",
  "period_ended",
  "set_finished",
  "event_deleted",
  "match_finished",
]

const eventSchema = z.object({ match: z.unknown() })

export function useMatchLive(id: string, enabled: boolean, onMatch: (match: MatchDetail) => void) {
  const [status, setStatus] = useState<RealtimeStatus>("connecting")

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    const sync = () =>
      getMatch(id, controller.signal).then(
        (match) => match && onMatch(match),
        () => undefined,
      )
    const disconnect = connectRealtime({
      channel: { type: "match", id },
      schema: eventSchema,
      eventNames: EVENT_NAMES,
      staleAfterMs: 40_000,
      onEvent: ({ match }) => {
        const parsed = matchDetailSchema.safeParse(match)
        if (parsed.success) onMatch(parsed.data)
        else void sync()
      },
      onReconnect: sync,
      onStatus: setStatus,
    })
    return () => {
      controller.abort()
      disconnect()
    }
  }, [id, enabled, onMatch])

  return enabled ? status : "closed"
}
