"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export type SiteNavItem = { href: string; label: string }

type Props = { brand: ReactNode; items: SiteNavItem[]; actions?: ReactNode }

// Ativo também em subcaminhos: /partidas/123 mantém "Jogos" marcado.
const isActive = (pathname: string, to: string) => pathname === to || pathname.startsWith(`${to}/`)

export function SiteNavbar({ brand, items, actions }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 md:h-16 md:flex-nowrap md:px-10">
        <div className="flex h-16 items-center">{brand}</div>
        <nav aria-label="Principal" className="order-last -mx-6 flex w-full gap-6 overflow-x-auto px-6 md:order-none md:mx-0 md:w-auto md:flex-1 md:px-0">
          {items.map(({ href, label }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "type-label relative flex h-12 shrink-0 items-center font-bold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 md:h-16",
                  active
                    ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                    : "text-muted-foreground hover:text-ink",
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  )
}
