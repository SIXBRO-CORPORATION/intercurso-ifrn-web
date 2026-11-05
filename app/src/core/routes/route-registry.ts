import type { RouteEntry } from "./types"

const PANEL = "/dashboard"

export const ROUTES = {
  home: { path: "/", access: "public" },
  login: { path: "/login", access: "public" },
  authCallback: { path: "/auth/callback", access: "public" },
  matches: { path: "/partidas", access: "public" },
  match: { path: "/partidas/:id", access: "public" },
  modalities: { path: "/modalidades", access: "public" },
  modalityTeams: { path: "/modalidades/:id/times", access: { minRole: "USER" } },
  myTeams: { path: "/equipes", access: { minRole: "USER" } },
  dashboard: { path: PANEL, access: { minRole: "USER" } },
  dashboardSection: { path: `${PANEL}/:section`, access: { minRole: "USER" } },
  manageMatches: { path: "/partidas/gerenciar", access: { minRole: "MONITOR" } },
  manageMatch: { path: "/partidas/gerenciar/:id", access: { minRole: "MONITOR" } },
} as const satisfies Record<string, RouteEntry>

export type RouteKey = keyof typeof ROUTES

type ParamNames<P extends string> = P extends `${string}:${infer Rest}`
  ? Rest extends `${infer Name}/${infer Tail}`
    ? Name | ParamNames<`/${Tail}`>
    : Rest
  : never

type PathOf<K extends RouteKey> = (typeof ROUTES)[K]["path"]

export function href<K extends RouteKey>(
  key: K,
  ...args: [ParamNames<PathOf<K>>] extends [never] ? [] : [params: Record<ParamNames<PathOf<K>>, string>]
): string {
  const params = (args[0] ?? {}) as Record<string, string>
  return ROUTES[key].path.replace(/:(\w+)/g, (_, name: string) => encodeURIComponent(params[name]))
}
