"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { FeatureList } from "@/features/dashboard/components/feature-list"
import { SECTIONS, canUse } from "@/features/dashboard/constants/sections"

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  const { user } = useAuth()
  const s = SECTIONS.find((x) => x.slug === section)
  const features = s?.features.filter((f) => canUse(user?.role, f.role)) ?? []
  if (!s || !features.length) notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">{s.label}</h1>
        <p className="text-muted-foreground">{s.summary}</p>
      </header>
      <FeatureList features={features} />
    </div>
  )
}
