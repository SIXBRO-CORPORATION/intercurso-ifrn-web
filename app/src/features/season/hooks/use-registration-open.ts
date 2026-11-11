"use client"

import { useEffect, useState } from "react"
import type { Season } from "../schemas/season-schema"
import { getRegistrationState } from "../utils/registration-state"

const CHECK_INTERVAL_MS = 15_000

export function useRegistrationOpen(season: Season | null | undefined) {
  const [open, setOpen] = useState(() => getRegistrationState(season, new Date()).open)

  useEffect(() => {
    const id = setInterval(() => setOpen(getRegistrationState(season, new Date()).open), CHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [season])

  return open
}
