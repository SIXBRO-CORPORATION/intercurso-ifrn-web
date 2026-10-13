
export type SessionUser = {
  userId: string
  name: string
  email: string | null
  matricula: string
  role: string
  atleta: boolean
}

export type SessionStatus = "loading" | "authenticated" | "anonymous"

export type SessionSnapshot = {
  status: SessionStatus
  user: SessionUser | null
}

const LOADING: SessionSnapshot = { status: "loading", user: null }

let accessToken: string | null = null
let snapshot: SessionSnapshot = LOADING
const listeners = new Set<() => void>()

function emit(next: SessionSnapshot) {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export const getAccessToken = () => accessToken
export const getSnapshot = () => snapshot
export const getServerSnapshot = () => LOADING

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setAccessToken(token: string) {
  accessToken = token
}

export function setSession(user: SessionUser) {
  emit({ status: "authenticated", user })
}

export function clearSession() {
  accessToken = null
  emit({ status: "anonymous", user: null })
}
