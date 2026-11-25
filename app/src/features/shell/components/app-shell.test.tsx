import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AppShell } from "./app-shell"

const state = vi.hoisted(() => ({
  pathname: "/partidas",
  auth: { status: "anonymous", user: null } as { status: string; user: { name: string; role: string } | null },
}))

vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }))
vi.mock("@/features/auth/contexts/auth-context", () => ({ useAuth: () => state.auth }))
vi.mock("@/features/season", () => ({ useActiveSeason: () => ({ data: { name: "Intercurso 2026" } }) }))

beforeEach(() => {
  state.pathname = "/partidas"
  state.auth = { status: "anonymous", user: null }
})

const renderShell = () => render(<AppShell>conteúdo</AppShell>)
const nav = () => within(screen.getByRole("navigation", { name: "Principal" }))
const names = () => nav().getAllByRole("link").map((link) => link.textContent)

describe("AppShell", () => {
  it("visitante vê só as rotas públicas, com a atual marcada em subcaminho", () => {
    state.pathname = "/partidas/abc"
    renderShell()

    expect(names()).toEqual(["Jogos", "Modalidades"])
    expect(nav().getByRole("link", { name: "Jogos" }).getAttribute("aria-current")).toBe("page")
    expect(screen.getByText("Intercurso 2026")).toBeTruthy()
    expect(screen.getAllByRole("link", { name: /Entrar com SUAP/ }).length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "Voltar" }).getAttribute("href")).toBe("/partidas")
  })

  it("aluno ganha Minhas equipes e o link para o perfil", () => {
    state.auth = { status: "authenticated", user: { name: "Pedro", role: "USER" } }
    renderShell()

    expect(names()).toEqual(["Jogos", "Modalidades", "Minhas equipes"])
    expect(screen.queryByRole("link", { name: /Entrar/ })).toBeNull()
    expect(screen.getAllByRole("link", { name: "Perfil" })[0].getAttribute("href")).toBe("/perfil")
  })

  it("monitor vê a gestão e o caminho mais específico fica ativo", () => {
    state.pathname = "/partidas/gerenciar"
    state.auth = { status: "authenticated", user: { name: "Maria", role: "MONITOR" } }
    renderShell()

    expect(nav().getByRole("link", { name: "Partidas" }).getAttribute("aria-current")).toBe("page")
    expect(nav().getByRole("link", { name: "Jogos" }).getAttribute("aria-current")).toBeNull()
    expect(screen.getByRole("button", { name: "Sair" })).toBeTruthy()
  })
})
