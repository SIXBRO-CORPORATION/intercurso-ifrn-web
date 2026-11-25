import type { Metadata } from "next"
import { Suspense } from "react"
import { MonitorMatchView } from "@/features/match/components/monitor-match-view"
import { ListSkeleton } from "@/shared/components/request-states"

export const metadata: Metadata = { title: "Gerenciar partidas | Intercurso IFRN" }

export default function ManageMatchesPage() {
  return (
    <Suspense fallback={<ListSkeleton label="Carregando partidas…" />}>
      <MonitorMatchView />
    </Suspense>
  )
}
