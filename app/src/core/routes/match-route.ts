import { ROUTES } from "./route-registry"
import type { Role, RouteAccess, RouteEntry } from "./types"

const RANK: Record<Role, number> = { USER: 0, MONITOR: 1, ADMIN: 2 }

const segments = (path: string) => (path === "/" ? [] : path.slice(1).split("/"))

const TABLE = Object.values<RouteEntry>(ROUTES).map((entry) => {
  const parts = segments(entry.path)
  return { entry, parts, score: parts.map((p) => (p.startsWith(":") ? "1" : "0")).join("") }
})

export function findRoute(pathname: string): RouteEntry | undefined {
  const target = segments(pathname.replace(/\/+$/, "") || "/")
  let best: (typeof TABLE)[number] | undefined
  for (const row of TABLE) {
    const matches =
      row.parts.length === target.length &&
      row.parts.every((p, i) => (p.startsWith(":") ? target[i] !== "" : p === target[i]))
    if (matches && (!best || row.score < best.score)) best = row
  }
  return best?.entry
}

export const hasRole = (userRole: string | undefined, needed: Role) =>
  (RANK[userRole as Role] ?? 0) >= RANK[needed]

export const canAccess = (access: RouteAccess, userRole: string | undefined) =>
  access === "public" || (userRole !== undefined && hasRole(userRole, access.minRole))
