import axios, { isAxiosError } from "axios"

import { getAccessToken } from "@/core/auth/session-store"

declare module "axios" {
  interface AxiosRequestConfig {
    retried?: boolean
  }
}

type RefreshHandler = () => Promise<boolean>
let refreshHandler: RefreshHandler | null = null

export function setRefreshHandler(handler: RefreshHandler) {
  refreshHandler = handler
}

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

export const authHttp = axios.create({ withCredentials: true, validateStatus: () => true })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set("Authorization", `Bearer ${token}`)
  return config
})

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!isAxiosError(error) || !error.config) throw error
  const { config, response } = error
  if (response?.status !== 401 || config.retried || !getAccessToken() || !refreshHandler) throw error
  if (!(await refreshHandler())) throw error
  return api.request({ ...config, retried: true })
})
