import type { Metadata } from "next"
import { Suspense } from "react"
import { MatchListView } from "@/features/match/components/match-list-view"
import { MatchListLoading } from "@/features/match/components/match-list-states"
import { PageHeader } from "@/shared/components/page-header"

export const metadata: Metadata = { title: "Partidas | Intercurso IFRN" }

export default function PartidasPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-10">
      <PageHeader title="Partidas" description="Acompanhe jogos e resultados da temporada ativa." />
      <Suspense fallback={<MatchListLoading />}>
        <MatchListView />
      </Suspense>
    </main>
  )
}
