import type { Metadata } from "next"
import { Suspense } from "react"
import { MatchListView } from "@/features/match/components/match-list-view"
import { ListSkeleton } from "@/shared/components/request-states"

export const metadata: Metadata = { title: "Jogos | Intercurso IFRN" }

export default function PartidasPage() {
  return (
    <Suspense fallback={<ListSkeleton label="Carregando partidas…" />}>
      <MatchListView />
    </Suspense>
  )
}
