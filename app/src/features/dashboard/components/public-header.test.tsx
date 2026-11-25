import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PublicHeader } from "./public-header"

const state = vi.hoisted(() => ({
  pathname: "/partidas",
  auth: { status: "anonymous", user: null } as { status: string; user: { name: string } | null },
}))

vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }))
vi.mock("@/features/auth/contexts/auth-context", () => ({ useAuth: () => state.auth }))
vi.mock("@/features/season", () => ({ useActiveSeason: () => ({ data: { name: "Intercurso 2026" } }) }))

beforeEach(() => {
  state.pathname = "/partidas"
  state.auth = { status: "anonymous", user: null }
})

describe("PublicHeader", () => {
  it("lista as páginas registradas e marca a atual, inclusive em subcaminho", () => {
    state.pathname = "/partidas/abc"
    render(<PublicHeader />)

    const nav = screen.getByRole("navigation", { name: "Principal" })
    expect(nav.querySelectorAll("a")).toHaveLength(3)
    expect(screen.getByRole("link", { name: "Jogos" }).getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("link", { name: "Modalidades" }).getAttribute("aria-current")).toBeNull()
    expect(screen.getByRole("link", { name: "Equipes" }).getAttribute("href")).toBe("/equipes")
    expect(screen.getByText("Intercurso 2026")).toBeTruthy()
  })

  it("visitante vê Entrar com SUAP", () => {
    render(<PublicHeader />)

    expect(screen.getByRole("link", { name: "Entrar com SUAP" })).toBeTruthy()
  })

  it("logado vê o link para o painel em vez do login", () => {
    state.auth = { status: "authenticated", user: { name: "Pedro" } }
    render(<PublicHeader />)

    expect(screen.queryByRole("link", { name: "Entrar com SUAP" })).toBeNull()
    expect(screen.getByRole("link", { name: "Ir para o painel" }).getAttribute("href")).toBe("/dashboard")
  })
})
