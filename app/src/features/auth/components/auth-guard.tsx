"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { useAuth } from "../contexts/auth-context"

export function AuthGuard({
  children,
  roles,
}: {
  children: ReactNode
  roles?: string[]
}) {
  const { status, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "anonymous") {
      saveReturnPath(window.location.pathname + window.location.search)
      router.replace("/login")
    }
  }, [status, router])

  if (status !== "authenticated") {
    return (
      <p role="status" className="p-6 text-muted-foreground">
        Carregando…
      </p>
    )
  }

  if (roles && user && user.role !== "ADMIN" && !roles.includes(user.role)) {
    return (
      <p role="alert" className="p-6 text-destructive">
        Você não tem permissão para acessar esta página.
      </p>
    )
  }

  return <>{children}</>
}
