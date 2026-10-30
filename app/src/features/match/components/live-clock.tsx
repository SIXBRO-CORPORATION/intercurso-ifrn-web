"use client"

import { useEffect, useState } from "react"
import { formatClock } from "../utils/match-card"

type Props = { seconds: number | null; running: boolean; limit?: number | null }

function Ticking({ seconds, limit }: { seconds: number; limit: number | null }) {
  const [elapsed, setElapsed] = useState(0)
  const total = limit == null ? seconds + elapsed : Math.min(seconds + elapsed, limit)
  const done = total === limit

  useEffect(() => {
    if (done) return
    const startedAt = Date.now()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(id)
  }, [done])

  return <>{formatClock(total)}</>
}

export function LiveClock({ seconds, running, limit = null }: Props) {
  const base = seconds ?? 0
  const capped = limit == null ? base : Math.min(base, limit)
  if (!running || capped === limit) return <>{formatClock(capped)}</>
  return <Ticking key={base} seconds={base} limit={limit} />
}
