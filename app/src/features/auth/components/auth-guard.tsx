"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { href } from "@/core/routes/route-registry"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { useAuth } from "../contexts/auth-context"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "anonymous") {
      saveReturnPath(window.location.pathname + window.location.search)
      router.replace(href("login"))
    }
  }, [status, router])

  if (status !== "authenticated") {
    return (
      <p role="status" className="p-6 text-muted-foreground">
        Carregando…
      </p>
    )
  }

  return <>{children}</>
}
