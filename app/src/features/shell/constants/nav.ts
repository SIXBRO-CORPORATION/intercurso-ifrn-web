import { CalendarRange, Radio, Shield, Timer, Trophy, type LucideIcon } from "lucide-react"
import type { RouteKey } from "@/core/routes/route-registry"

type NavKey = Extract<RouteKey, "matches" | "modalities" | "myTeams" | "manageMatches" | "seasons">
export type NavItem = { key: NavKey; label: string; short?: string; icon: LucideIcon; group: "Aluno" | "Gestão" }

// Só rotas registradas: Chaveamento e Equipes (monitor) entram quando as páginas existirem.
// A visibilidade por papel vem do `access` do registro.
export const NAV: NavItem[] = [
  { key: "matches", label: "Jogos", icon: Radio, group: "Aluno" },
  { key: "modalities", label: "Modalidades", icon: Trophy, group: "Gestão" },
  { key: "myTeams", label: "Minhas equipes", short: "Equipes", icon: Shield, group: "Aluno" },
  { key: "manageMatches", label: "Partidas", icon: Timer, group: "Gestão" },
  { key: "seasons", label: "Temporada", icon: CalendarRange, group: "Gestão" },
]

type Page = { key: RouteKey; title: string; back?: Extract<RouteKey, "matches" | "modalities" | "manageMatches" | "seasons">; mobileTitleOnly?: boolean }

export const PAGES: Page[] = [
  { key: "matches", title: "Jogos", mobileTitleOnly: true },
  { key: "match", title: "Partida", back: "matches" },
  { key: "login", title: "Entrar", back: "matches", mobileTitleOnly: true },
  { key: "modalities", title: "Modalidades" },
  { key: "modalityTeams", title: "Times da modalidade", back: "modalities" },
  { key: "myTeams", title: "Minhas equipes" },
  { key: "manageMatches", title: "Partidas" },
  { key: "manageMatch", title: "Controle da partida", back: "manageMatches" },
  { key: "seasons", title: "Temporadas" },
  { key: "seasonCreate", title: "Criar temporada", back: "seasons" },
  { key: "season", title: "Temporada", back: "seasons" },
  { key: "profile", title: "Perfil" },
]
