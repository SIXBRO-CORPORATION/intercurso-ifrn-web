"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { BrandMark } from "@/features/auth/components/brand-mark"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { OVERVIEW, SECTIONS, canUse } from "../constants/sections"
import { DashboardTopbar } from "./dashboard-topbar"

const ROLE_LABEL: Record<string, string> = { USER: "Aluno", MONITOR: "Monitor", ADMIN: "Administrador" }

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const items = [OVERVIEW, ...SECTIONS.filter((s) => s.features.some((f) => canUse(user?.role, f.role)))]
  const role = user?.role ?? "USER"

  const logoutButton = (
    <Button variant="ghost" size="icon" aria-label="Sair" onClick={() => void logout()}>
      <LogOut />
    </Button>
  )

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="sticky top-0 z-20 flex shrink-0 flex-col gap-3 border-b border-border bg-card px-6 py-3 md:h-svh md:w-72 md:gap-6 md:border-r md:border-b-0 md:p-6">
        <div className="flex items-center justify-between">
          <BrandMark />
          <div className="md:hidden">{logoutButton}</div>
        </div>
        <nav aria-label="Seções" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-1 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0">
          {items.map(({ slug, label, icon: Icon }) => {
            const href = slug ? `/dashboard/${slug}` : "/dashboard"
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap outline-none transition duration-150 focus-visible:ring-3 focus-visible:ring-ring/40 md:h-11 md:gap-3 md:text-base",
                  active
                    ? "bg-primary text-primary-foreground md:bg-primary-soft md:font-bold md:text-primary-dark"
                    : "bg-field text-muted-foreground hover:bg-border md:bg-transparent md:hover:bg-field",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden items-center gap-3 border-t border-border pt-4 md:flex">
          <Avatar name={user?.name} />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="type-body truncate font-bold text-ink">{user?.name}</p>
            <Badge variant={role === "USER" ? "neutral" : "dark"}>{ROLE_LABEL[role] ?? role}</Badge>
          </div>
          {logoutButton}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
