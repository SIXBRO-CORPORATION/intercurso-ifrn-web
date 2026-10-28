"use client"

import { useCallback, useEffect, useState } from "react"

type Result<T> = { key: string; data: T } | { key: string; failed: true }

export function useRequest<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
    const [attempt, setAttempt] = useState(0)
    const [result, setResult] = useState<Result<T> | null>(null)
    const requestKey = `${key}#${attempt}`

    useEffect(() => {
        const controller = new AbortController()
        load(controller.signal).then(
            (data) => setResult({ key: requestKey, data }),
            () => {
                if (!controller.signal.aborted) setResult({ key: requestKey, failed: true })
            },
        )
        return () => controller.abort()
    }, [requestKey, load])

    const retry = useCallback(() => setAttempt((value) => value + 1), [])

    if (result?.key !== requestKey) return { status: "loading", retry } as const
    if ("failed" in result) return { status: "error", retry } as const
    return { status: "success", data: result.data, retry } as const
}
