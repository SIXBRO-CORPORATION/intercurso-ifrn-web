"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type SessionStatus,
  type SessionUser,
} from "@/core/auth/session-store"
import { bootstrapSession, logout, startLogin } from "../services/auth-service"

type AuthContextValue = {
  status: SessionStatus
  user: SessionUser | null
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    void bootstrapSession()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ ...session, login: startLogin, logout }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return context
}
