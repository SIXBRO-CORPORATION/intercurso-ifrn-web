"use client"

import { useEffect, useState } from "react"
import { formatClock } from "../utils/match-card"

function Ticking({ seconds }: { seconds: number }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  return <>{formatClock(seconds + elapsed)}</>
}

export function LiveClock({ seconds, running }: { seconds: number | null; running: boolean }) {
  if (!running) return <>{formatClock(seconds)}</>
  return <Ticking key={seconds ?? 0} seconds={seconds ?? 0} />
}
