import { describe, expect, it } from "vitest"
import { canAccess, findRoute } from "./match-route"
import { ROUTES } from "./route-registry"

describe("findRoute", () => {
  it("casa caminho estático", () => {
    expect(findRoute("/partidas")).toBe(ROUTES.matches)
    expect(findRoute("/")).toBe(ROUTES.home)
  })

  it("casa segmento dinâmico com exatamente um segmento", () => {
    expect(findRoute("/partidas/42")).toBe(ROUTES.match)
    expect(findRoute("/partidas/42/extra")).toBeUndefined()
    expect(findRoute("/modalidades//times")).toBeUndefined()
  })

  it("estático vence dinâmico", () => {
    expect(findRoute("/partidas/gerenciar")).toBe(ROUTES.manageMatches)
    expect(findRoute("/dashboard/partidas")).toBe(ROUTES.dashboardSection)
  })

  it("ignora barra final", () => {
    expect(findRoute("/partidas/")).toBe(ROUTES.matches)
    expect(findRoute("/partidas/gerenciar/7/")).toBe(ROUTES.manageMatch)
  })

  it("não casa caminho não registrado", () => {
    expect(findRoute("/admin")).toBeUndefined()
    expect(findRoute("/equipes/nova")).toBeUndefined()
    expect(findRoute("/dashboard/a/b")).toBeUndefined()
  })
})

describe("canAccess", () => {
  it("libera rota pública para qualquer um", () => {
    expect(canAccess("public", undefined)).toBe(true)
  })

  it("exige papel mínimo", () => {
    const monitor = { minRole: "MONITOR" } as const
    expect(canAccess(monitor, "USER")).toBe(false)
    expect(canAccess(monitor, "MONITOR")).toBe(true)
    expect(canAccess(monitor, "ADMIN")).toBe(true)
  })

  it("nega anônimo em rota protegida", () => {
    expect(canAccess({ minRole: "USER" }, undefined)).toBe(false)
  })
})
