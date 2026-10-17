import axios from "axios"

import { getAccessToken } from "@/core/auth/session-store"

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set("Authorization", `Bearer ${token}`)
  return config
})
