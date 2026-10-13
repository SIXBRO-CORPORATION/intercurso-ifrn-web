"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { AuthStatusScreen } from "@/features/auth/components/auth-status-screen"
import { DEFAULT_AUTHENTICATED_PATH } from "@/features/auth/constants"
import { takeReturnPath } from "@/infrastructure/storage/return-to-storage"

export default function AuthCallbackPage() {
  const { status } = useAuth()
  const router = useRouter()
  const done = useRef(false)

  useEffect(() => {
    if (done.current || status === "loading") return
    done.current = true
    router.replace(
        status === "authenticated"
            ? (takeReturnPath() ?? DEFAULT_AUTHENTICATED_PATH)
            : "/login?erro=sessao_nao_recuperada",
    )
  }, [status, router])

  return <AuthStatusScreen message="Concluindo login…" />
}