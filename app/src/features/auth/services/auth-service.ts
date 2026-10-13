import {
  clearSession,
  getSnapshot,
  setAccessToken,
  setSession,
  type SessionUser,
} from "@/core/auth/session-store"
import { setRefreshHandler } from "@/infrastructure/http/api-client"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { AUTH_API, LOGIN_URL } from "../constants"

type Envelope<T> = { data: T | null }
type RefreshData = { access_token: string }
type MeData = {
  user_id: string
  name: string
  email?: string | null
  matricula: string
  role: string
  atleta: boolean
}

function toSessionUser(me: MeData): SessionUser {
  return {
    userId: me.user_id,
    name: me.name,
    email: me.email ?? null,
    matricula: me.matricula,
    role: me.role,
    atleta: me.atleta,
  }
}

let inflight: Promise<boolean> | null = null

export function refreshSession(): Promise<boolean> {
  inflight ??= doRefresh().finally(() => {
    inflight = null
  })
  return inflight
}

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_API}/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (res.status === 401) {
      clearSession()
      return false
    }
    if (!res.ok) return false // falha transitória: não derruba a sessão local

    const token = ((await res.json()) as Envelope<RefreshData>).data?.access_token
    if (!token) return false
    setAccessToken(token)

    // Só busca o usuário quando ainda não o temos (bootstrap), não a cada renovação.
    if (!getSnapshot().user) {
      const me = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
      const user = me.ok ? ((await me.json()) as Envelope<MeData>).data : null
      if (!user) {
        clearSession()
        return false
      }
      setSession(toSessionUser(user))
    }
    return true
  } catch {
    return false
  }
}

export async function bootstrapSession() {
  await refreshSession()
  if (getSnapshot().status === "loading") clearSession()
}

export async function logout() {
  try {
    await fetch(`${AUTH_API}/logout`, { method: "POST", credentials: "include" })
  } catch {
  }
  clearSession()
}

export function startLogin() {
  saveReturnPath(window.location.pathname + window.location.search)
  window.location.assign(LOGIN_URL)
}

setRefreshHandler(refreshSession)
