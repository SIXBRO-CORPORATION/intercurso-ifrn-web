"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { canAccess, findRoute } from "@/core/routes/match-route"
import { useAuth } from "../contexts/auth-context"

export function PermissionDenied() {
  return (
    <p role="alert" className="p-6 text-destructive">
      Você não tem permissão para acessar esta página.
    </p>
  )
}

export function AccessGate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const route = findRoute(usePathname())

  if (!route || !canAccess(route.access, user?.role)) return <PermissionDenied />
  return <>{children}</>
}
