"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { PermissionDenied } from "@/features/auth/components/access-gate"
import { useAuth } from "@/features/auth/contexts/auth-context"
import { FeatureList } from "@/features/dashboard/components/feature-list"
import { SECTIONS, canUse } from "@/features/dashboard/constants/sections"
import { PageHeader } from "@/shared/components/page-header"

export default function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  const { user } = useAuth()
  const s = SECTIONS.find((x) => x.slug === section)
  const features = s?.features.filter((f) => canUse(user?.role, f.role)) ?? []
  if (!s) notFound()
  if (!features.length) return <PermissionDenied />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title={s.label} description={s.summary} />
      <FeatureList features={features} />
    </div>
  )
}
