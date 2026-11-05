export type Role = "USER" | "MONITOR" | "ADMIN"

export type RouteAccess = "public" | { minRole: Role }

export type RouteEntry = { path: string; access: RouteAccess }
