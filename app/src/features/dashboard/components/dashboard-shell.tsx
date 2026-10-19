"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { BrandMark } from "@/features/auth/components/brand-mark"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { OVERVIEW, SECTIONS, canUse } from "../constants/sections"

const ROLE_LABEL: Record<string, string> = { USER: "Aluno", MONITOR: "Monitor", ADMIN: "Administrador" }

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const items = [OVERVIEW, ...SECTIONS.filter((s) => s.features.some((f) => canUse(user?.role, f.role)))]

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-4 bg-brand-900 p-4 text-white md:sticky md:top-0 md:h-svh md:w-64">
        <BrandMark tone="light" />
        <nav aria-label="Seções" className="flex gap-1 overflow-x-auto md:flex-1 md:flex-col md:overflow-visible">
          {items.map(({ slug, label, icon: Icon }) => {
            const href = slug ? `/dashboard/${slug}` : "/dashboard"
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70",
                  active ? "bg-white text-brand-800" : "text-brand-100 hover:bg-white/10",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-3 border-t border-white/15 pt-4">
          <div className="min-w-0 flex-1 text-sm leading-tight">
            <p className="truncate font-semibold">{user?.name}</p>
            <p className="text-xs text-brand-200">{ROLE_LABEL[user?.role ?? "USER"] ?? user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Sair" className="text-white hover:bg-white/10 hover:text-white" onClick={() => void logout()}>
            <LogOut />
          </Button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 bg-brand-50/40 p-6 md:p-10">{children}</main>
    </div>
  )
}
