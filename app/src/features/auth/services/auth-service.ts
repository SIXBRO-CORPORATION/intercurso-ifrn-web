import {
  clearSession,
  getSnapshot,
  setAccessToken,
  setSession,
  type SessionUser,
} from "@/core/auth/session-store"
import { AUTH_API } from "@/core/config/endpoints"
import { authHttp, setRefreshHandler } from "@/lib/axios"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { LOGIN_URL } from "../constants"

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

const isOk = (status: number) => status >= 200 && status < 300

async function doRefresh(): Promise<boolean> {
  try {
    const res = await authHttp.post<Envelope<RefreshData>>(`${AUTH_API}/refresh`)
    if (res.status === 401) {
      clearSession()
      return false
    }
    if (!isOk(res.status)) return false // falha transitória: não derruba a sessão local

    const token = res.data?.data?.access_token
    if (!token) return false
    setAccessToken(token)

    // Só busca o usuário quando ainda não o temos (bootstrap), não a cada renovação.
    if (!getSnapshot().user) {
      const me = await authHttp.get<Envelope<MeData>>(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = isOk(me.status) ? me.data?.data : null
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
    await authHttp.post(`${AUTH_API}/logout`)
  } catch {
  }
  clearSession()
}

export function startLogin() {
  saveReturnPath(window.location.pathname + window.location.search)
  window.location.assign(LOGIN_URL)
}

setRefreshHandler(refreshSession)
