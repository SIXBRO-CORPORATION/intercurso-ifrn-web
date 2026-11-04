import { readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { ROUTES, href } from "./route-registry"

const APP_DIR = fileURLToPath(new URL("../../../app", import.meta.url))

function pagePaths() {
  return readdirSync(APP_DIR, { recursive: true, encoding: "utf8" })
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => file === "page.tsx" || file.endsWith("/page.tsx"))
    .map((file) => {
      const parts = file
        .slice(0, -"page.tsx".length)
        .split("/")
        .filter((part) => part && !/^\(.+\)$/.test(part))
        .map((part) => part.replace(/^\[(.+)\]$/, ":$1"))
      return "/" + parts.join("/")
    })
    .sort()
}

describe("registro de rotas", () => {
  it("cobre exatamente as páginas de app/", () => {
    const registered = Object.values(ROUTES).map((r) => r.path).sort()
    expect(pagePaths()).toEqual(registered)
  })
})

describe("href", () => {
  it("monta caminho sem parâmetro", () => {
    expect(href("manageMatches")).toBe("/partidas/gerenciar")
  })

  it("substitui e codifica parâmetros", () => {
    expect(href("manageMatch", { id: "a b" })).toBe("/partidas/gerenciar/a%20b")
    expect(href("modalityTeams", { id: "9" })).toBe("/modalidades/9/times")
  })

  it("falha em tipo quando falta parâmetro", () => {
    // @ts-expect-error parâmetro obrigatório
    href("match")
  })
})
