import { getAccessToken } from "@/core/auth/session-store"

type RefreshHandler = () => Promise<boolean>
let refreshHandler: RefreshHandler | null = null

export function setRefreshHandler(handler: RefreshHandler) {
  refreshHandler = handler
}

function send(input: string, init: RequestInit) {
  const headers = new Headers(init.headers)
  const token = getAccessToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  return fetch(input, { ...init, headers, credentials: "include" })
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const response = await send(input, init)

  if (response.status !== 401 || !getAccessToken() || !refreshHandler) {
    return response
  }
  if (!(await refreshHandler())) return response

  return send(input, init)
}
