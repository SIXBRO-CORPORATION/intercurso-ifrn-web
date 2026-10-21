"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { SECTIONS, canUse } from "@/features/dashboard/constants/sections"
import { PageHeader } from "@/shared/components/page-header"
import { RevealItem } from "@/shared/components/reveal-item"
import { Card } from "@/shared/components/ui/card"

export default function DashboardPage() {
  const { user } = useAuth()
  const visible = SECTIONS.map((s) => ({ ...s, mine: s.features.filter((f) => canUse(user?.role, f.role)) })).filter((s) => s.mine.length)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader title={`Olá, ${user?.name}`} description="Escolha uma área para começar." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ slug, label, icon: Icon, summary, mine }, i) => (
          <RevealItem key={slug} index={i}>
            <Card
              asChild
              className="flex h-full flex-col gap-3 p-5 outline-none transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <Link href={`/dashboard/${slug}`}>
                <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary-dark">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="type-section text-ink">{label}</span>
                <span className="type-body-sm text-muted-foreground">{summary}</span>
                <span className="type-caption mt-auto flex items-center justify-between pt-1 text-primary-dark">
                  {mine.length} funcionalidades para você
                  <ChevronRight className="size-5 text-faint" aria-hidden />
                </span>
              </Link>
            </Card>
          </RevealItem>
        ))}
      </ul>
    </div>
  )
}
