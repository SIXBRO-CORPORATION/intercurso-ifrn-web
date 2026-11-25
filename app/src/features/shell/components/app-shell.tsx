"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, CalendarDays, Lock, LogOut } from "lucide-react"
import { canAccess, findRoute, hasRole } from "@/core/routes/match-route"
import { href, ROUTES } from "@/core/routes/route-registry"
import { BrandMark } from "@/features/auth/components/brand-mark"
import { LoginButton } from "@/features/auth/components/login-button"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { useActiveSeason } from "@/features/season"
import { cn } from "@/lib/utils"
import { Avatar } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { NAV, PAGES, type NavItem } from "../constants/nav"
import { UserChip } from "./user-chip"

const FOCUS = "outline-none focus-visible:ring-3 focus-visible:ring-ring"

// O item ativo é o de caminho mais longo: /partidas/gerenciar marca "Partidas", não "Jogos".
function activeKey(pathname: string, items: NavItem[]) {
  let best: NavItem | undefined
  for (const item of items) {
    const { path } = ROUTES[item.key]
    const matches = pathname === path || pathname.startsWith(`${path}/`)
    if (matches && (!best || path.length > ROUTES[best.key].path.length)) best = item
  }
  return best?.key
}

type NavProps = { items: NavItem[]; active?: string }

function Sidebar({ items, active }: NavProps) {
  const { user, logout } = useAuth()
  return (
    <aside className="sticky top-0 hidden h-svh w-58 shrink-0 flex-col gap-4 bg-chrome px-3 py-4 md:flex">
      <Link href={href("matches")} aria-label="Intercurso IFRN, ir para Jogos" className={cn("rounded-md px-2", FOCUS)}>
        <BrandMark white />
      </Link>
      <nav aria-label="Principal" className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {(["Aluno", "Gestão"] as const).map((group) => (
          <div key={group} className="flex flex-col gap-0.5">
            <p className="type-overline px-3 pb-1.5 text-muted-foreground">{group}</p>
            {items
              .filter((item) => item.group === group)
              .map(({ key, label, icon: Icon }) => (
                <Link
                  key={key}
                  href={ROUTES[key].path}
                  aria-current={active === key ? "page" : undefined}
                  className={cn(
                    "group flex h-10 items-center gap-2.5 rounded-md px-3 font-medium text-text-secondary hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
                    FOCUS,
                  )}
                >
                  <Icon className="size-4.5 group-aria-[current=page]:text-primary-text" aria-hidden />
                  {label}
                </Link>
              ))}
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-1 border-t border-border pt-3 pl-2">
        <Link href={href("profile")} className={cn("min-w-0 flex-1 rounded-md", FOCUS)}>
          <UserChip name={user?.name} role={user?.role} />
        </Link>
        <Button variant="ghost" size="icon" aria-label="Sair" onClick={() => void logout()}>
          <LogOut aria-hidden />
        </Button>
      </div>
    </aside>
  )
}

function ProfileLink({ name }: { name: string }) {
  return (
    <Link href={href("profile")} aria-label="Perfil" title={name} className={cn("rounded-full", FOCUS)}>
      <Avatar name={name} tone="brand" />
    </Link>
  )
}

function SessionAction() {
  const { status, user } = useAuth()
  if (status === "authenticated" && user) return <ProfileLink name={user.name} />
  if (status !== "anonymous") return null
  return (
    <LoginButton size="default">
      <Lock aria-hidden />
      <span className="md:hidden">Entrar</span>
      <span className="hidden md:inline">Entrar com SUAP</span>
    </LoginButton>
  )
}

function PublicHeader({ items, active }: NavProps) {
  const season = useActiveSeason()
  return (
    <header className="sticky top-0 z-20 hidden h-16 shrink-0 items-center gap-10 bg-chrome px-6 md:flex">
      <Link href={href("matches")} aria-label="Intercurso IFRN, ir para Jogos" className={cn("rounded-md", FOCUS)}>
        <BrandMark />
      </Link>
      <nav aria-label="Principal" className="flex gap-2 self-stretch">
        {items.map(({ key, label }) => (
          <Link
            key={key}
            href={ROUTES[key].path}
            aria-current={active === key ? "page" : undefined}
            className={cn(
              "flex items-center border-y-2 border-transparent px-3.5 font-medium text-text-secondary hover:text-foreground aria-[current=page]:border-b-primary aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
              FOCUS,
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {season.data && (
          <span className="flex h-9 items-center gap-2 rounded-full bg-muted px-3.5 font-semibold whitespace-nowrap">
            <CalendarDays className="size-4" aria-hidden />
            {season.data.name}
          </span>
        )}
        <SessionAction />
      </div>
    </header>
  )
}

function BottomNav({ items, active, anonymous }: NavProps & { anonymous: boolean }) {
  const entries = items.map(({ key, label, short, icon }) => ({ key: key as string, to: ROUTES[key].path as string, label: short ?? label, icon }))
  if (anonymous) entries.push({ key: "login", to: href("login"), label: "Entrar", icon: Lock })
  return (
    <nav aria-label="Navegação inferior" className="fixed inset-x-0 bottom-0 z-20 flex h-16 border-t border-border bg-chrome pb-1.5 md:hidden">
      {entries.map(({ key, to, label, icon: Icon }) => (
        <Link
          key={key}
          href={to}
          aria-current={active === key ? "page" : undefined}
          className={cn(
            "group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium text-muted-foreground aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
            FOCUS,
          )}
        >
          <Icon className="size-5.5 group-aria-[current=page]:text-primary-text" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { status, user } = useAuth()
  const pathname = usePathname()
  const role = status === "authenticated" ? user?.role : undefined
  const monitor = hasRole(role, "MONITOR")
  const items = NAV.filter((item) => canAccess(ROUTES[item.key].access, role))
  const active = pathname === ROUTES.login.path ? "login" : activeKey(pathname, items)
  const route = findRoute(pathname)
  const page = PAGES.find(({ key }) => ROUTES[key] === route)
  const width = monitor ? "max-w-6xl" : "max-w-7xl"

  return (
    <div className="flex min-h-svh">
      {monitor && <Sidebar items={items} active={active} />}
      <div className="flex min-w-0 flex-1 flex-col">
        {!monitor && <PublicHeader items={items} active={active} />}
        {page && (
          <div
            className={cn(
              "sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-chrome px-3",
              monitor
                ? "md:static md:border-b md:border-border md:bg-transparent md:px-6"
                : page.mobileTitleOnly
                  ? "md:sr-only"
                  : cn("md:static md:mx-auto md:h-auto md:w-full md:bg-transparent md:px-6 md:pt-6", width),
            )}
          >
            {page.back ? (
              <Button asChild variant="ghost" size="icon">
                <Link href={href(page.back)} aria-label="Voltar">
                  <ArrowLeft aria-hidden />
                </Link>
              </Button>
            ) : (
              <span className="px-1 md:hidden">
                <BrandMark compact white />
              </span>
            )}
            <h1 className="type-h2 min-w-0 flex-1 truncate md:text-[1.375rem] md:font-bold">{page.title}</h1>
            <div className="md:hidden">
              <SessionAction />
            </div>
          </div>
        )}
        <main className={cn("mx-auto w-full flex-1 p-4 pb-24 md:p-6", width)}>{children}</main>
      </div>
      <BottomNav items={items} active={active} anonymous={status === "anonymous"} />
    </div>
  )
}
