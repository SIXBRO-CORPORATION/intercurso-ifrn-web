"use client"

import Link from "next/link"
import { ChevronRight, LogOut } from "lucide-react"
import { canAccess } from "@/core/routes/match-route"
import { ROUTES } from "@/core/routes/route-registry"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { Card } from "@/shared/components/ui/card"
import { NAV } from "../constants/nav"
import { UserChip } from "./user-chip"

const ROW =
  "flex min-h-13 w-full items-center gap-3 border-b border-border px-4 text-left font-medium outline-none last:border-b-0 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"

export function ProfileView() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-xl space-y-4">
      <UserChip name={user?.name} role={user?.role} />
      <Card asChild>
        <ul>
          {NAV.filter((item) => canAccess(ROUTES[item.key].access, user?.role)).map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <Link href={ROUTES[key].path} className={ROW}>
                <Icon className="size-4.5" aria-hidden />
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
          <li>
            <button type="button" className={ROW} onClick={() => void logout()}>
              <LogOut className="size-4.5" aria-hidden />
              <span className="flex-1">Sair</span>
            </button>
          </li>
        </ul>
      </Card>
    </div>
  )
}
