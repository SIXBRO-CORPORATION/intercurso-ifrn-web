"use client"

import { useEffect, useState } from "react"
import { formatClockWithExtra } from "../utils/match-card"

type Props = { seconds: number | null; running: boolean; limit?: number | null }

function Ticking({ seconds, limit }: { seconds: number; limit: number | null }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  return <Clock seconds={seconds + elapsed} limit={limit} />
}

function Clock({ seconds, limit }: { seconds: number; limit: number | null }) {
  const { main, extra } = formatClockWithExtra(seconds, limit)
  return (
    <>
      {main}
      {extra && (
        <span className="text-warning-text">
          <span className="sr-only"> acréscimos </span>
          <span aria-hidden> +</span>
          {extra}
        </span>
      )}
    </>
  )
}

export function LiveClock({ seconds, running, limit = null }: Props) {
  const base = seconds ?? 0
  if (!running) return <Clock seconds={base} limit={limit} />
  return <Ticking key={base} seconds={base} limit={limit} />
}
