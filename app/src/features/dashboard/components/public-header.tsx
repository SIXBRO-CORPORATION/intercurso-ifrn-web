"use client"

import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { href } from "@/core/routes/route-registry"
import { Avatar } from "@/shared/components/ui/avatar"
import { SiteNavbar, type SiteNavItem } from "@/shared/components/site-navbar"
import { BrandMark } from "@/features/auth/components/brand-mark"
import { LoginButton } from "@/features/auth/components/login-button"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { useActiveSeason } from "@/features/season"

// Só rotas registradas: Chaves e Temporadas entram quando as páginas existirem.
const ITEMS: SiteNavItem[] = [
  { href: href("matches"), label: "Jogos" },
  { href: href("modalities"), label: "Modalidades" },
  { href: href("myTeams"), label: "Equipes" },
]

export function PublicHeader() {
  const { status, user } = useAuth()
  const season = useActiveSeason()

  return (
    <SiteNavbar
      brand={
        <Link href={href("matches")} aria-label="Intercurso IFRN, ir para Jogos" className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <BrandMark />
        </Link>
      }
      items={ITEMS}
      actions={
        <>
          {season.data && (
            <span className="type-label hidden h-11 items-center gap-2 rounded-full border border-border bg-card px-4 font-bold text-ink sm:inline-flex">
              <CalendarDays className="size-5" aria-hidden />
              {season.data.name}
            </span>
          )}
          {status === "authenticated" && user ? (
            <Link href={href("dashboard")} className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40" aria-label="Ir para o painel">
              <Avatar name={user.name} />
              <span className="type-label hidden max-w-40 truncate font-bold text-ink lg:block">{user.name}</span>
            </Link>
          ) : (
            status === "anonymous" && <LoginButton />
          )}
        </>
      }
    />
  )
}
