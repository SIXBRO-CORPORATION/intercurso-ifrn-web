"use client"

import { useCallback } from "react"
import { useAuth } from "../contexts/auth-context"

export function useRequireAuth() {
  const { status, login } = useAuth()

  return useCallback(
    (action: () => void) => {
      if (status === "authenticated") action()
      else if (status === "anonymous") login()
    },
    [status, login],
  )
}
