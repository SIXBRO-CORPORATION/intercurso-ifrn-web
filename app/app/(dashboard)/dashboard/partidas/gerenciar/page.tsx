import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { MatchListLoading } from "@/features/match/components/match-list-states"
import { MonitorMatchView } from "@/features/match/components/monitor-match-view"
import { BackButton } from "@/shared/components/back-button"
import { PageHeader } from "@/shared/components/page-header"

export const metadata: Metadata = { title: "Gerenciar partidas | Intercurso IFRN" }

export default function ManageMatchesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackButton href="/dashboard/partidas" />
      <AuthGuard roles={["MONITOR"]}>
        <PageHeader title="Partidas" description="Inicie e gerencie os jogos da temporada." />
        <Suspense fallback={<MatchListLoading />}>
          <MonitorMatchView />
        </Suspense>
      </AuthGuard>
    </div>
  )
}
