import { QueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"

const MAX_RETRIES = 2

export function shouldRetry(failureCount: number, error: unknown) {
  if (isAxiosError(error) && error.response && error.response.status < 500) return false
  return failureCount < MAX_RETRIES
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry,
      },
    },
  })
}
