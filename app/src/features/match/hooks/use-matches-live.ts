"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { connectRealtime } from "@/infrastructure/realtime/realtime-client"
import { MATCH_EVENT_NAMES } from "../constants"

const REFRESH_DELAY_MS = 500
const STALE_AFTER_MS = 40_000

export function useMatchesLive(seasonId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const refresh = () => {
      if (timer) return
      timer = setTimeout(() => {
        timer = undefined
        void queryClient.invalidateQueries({ queryKey: ["matches"] })
      }, REFRESH_DELAY_MS)
    }

    const disconnect = connectRealtime({
      channel: { type: "season", id: seasonId },
      schema: z.unknown(),
      eventNames: MATCH_EVENT_NAMES,
      staleAfterMs: STALE_AFTER_MS,
      onEvent: refresh,
      onReconnect: refresh,
    })

    return () => {
      clearTimeout(timer)
      disconnect()
    }
  }, [seasonId, queryClient])
}
