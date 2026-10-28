
"use client"

import { useCallback, useEffect, useState } from "react"

type Result<T> = { key: string; data: T } | { key: string; failed: true }

type RequestState<T> =
    | { status: "loading"; retry: () => void }
    | { status: "error"; retry: () => void }
    | { status: "success"; data: T; retry: () => void }

export function useRequest<T>(
    key: string,
    load: (signal: AbortSignal) => Promise<T>,
): RequestState<T> {
    const [attempt, setAttempt] = useState(0)
    const [result, setResult] = useState<Result<T> | null>(null)
    const requestKey = `${key}#${attempt}`

    useEffect(() => {
        const controller = new AbortController()

        load(controller.signal).then(
            (data) => setResult({ key: requestKey, data }),
            () => {
                if (!controller.signal.aborted) {
                    setResult({ key: requestKey, failed: true })
                }
            },
        )

        return () => controller.abort()
    }, [requestKey, load])

    const retry = useCallback(() => setAttempt((value) => value + 1), [])

    if (result?.key !== requestKey) {
        return { status: "loading", retry }
    }

    if ("failed" in result) {
        return { status: "error", retry }
    }

    return { status: "success", data: result.data, retry }
}
