"use client"

import { usePathname } from "next/navigation"
import { Bell, CalendarDays, ChevronDown } from "lucide-react"
import { Avatar } from "@/shared/components/ui/avatar"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { useActiveSeason } from "@/features/season"
import { OVERVIEW, SECTIONS, canUse } from "../constants/sections"

const PILL = "type-label inline-flex h-11 cursor-default items-center gap-2 rounded-full border border-border bg-card px-4 font-bold text-ink"

export function DashboardTopbar() {
  const { user } = useAuth()
  const season = useActiveSeason()
  const slug = usePathname().split("/")[2]
  const title = SECTIONS.find((s) => s.slug === slug)?.label ?? OVERVIEW.label
  const seasonName = season.data?.name ?? "Sem temporada"
  const monitor = canUse(user?.role, "MONITOR")

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-6 md:sticky md:top-0 md:z-10 md:px-10">
      <p className="type-label truncate font-bold text-ink">{title}</p>
      <div className="flex items-center gap-3">
        {monitor ? (
          <button type="button" aria-disabled="true" className={PILL}>
            <CalendarDays className="size-5" aria-hidden />
            {seasonName}
            <ChevronDown className="size-4" aria-hidden />
          </button>
        ) : (
          <span className={PILL}>
            <CalendarDays className="size-5" aria-hidden />
            {seasonName}
          </span>
        )}
        <button type="button" aria-disabled="true" aria-label="Notificações" className={`${PILL} size-11 justify-center px-0`}>
          <Bell className="size-5" aria-hidden />
        </button>
        <div className="flex items-center gap-2">
          <Avatar name={user?.name} />
          <span className="type-label hidden max-w-40 truncate font-bold text-ink sm:block">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
