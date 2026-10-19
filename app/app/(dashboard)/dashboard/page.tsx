"use client"

import Link from "next/link"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { SECTIONS, canUse } from "@/features/dashboard/constants/sections"

export default function DashboardPage() {
  const { user } = useAuth()
  const visible = SECTIONS.map((s) => ({ ...s, mine: s.features.filter((f) => canUse(user?.role, f.role)) })).filter((s) => s.mine.length)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">Olá, {user?.name}</h1>
        <p className="text-muted-foreground">Escolha uma área para começar.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ slug, label, icon: Icon, summary, mine }) => (
          <li key={slug}>
            <Link
              href={`/dashboard/${slug}`}
              className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 outline-none transition-colors hover:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-lg font-bold text-brand-900">{label}</span>
              <span className="text-sm text-muted-foreground">{summary}</span>
              <span className="mt-auto text-xs font-medium text-brand-700">{mine.length} funcionalidades para você</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
