import type { Metadata } from "next"
import { Suspense } from "react"
import { MatchListView } from "@/features/match/components/match-list-view"
import { MatchListLoading } from "@/features/match/components/match-list-states"

export const metadata: Metadata = { title: "Partidas | Intercurso IFRN" }

export default function PartidasPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">Partidas</h1>
        <p className="text-muted-foreground">Acompanhe jogos e resultados da temporada ativa.</p>
      </header>
      <Suspense fallback={<MatchListLoading />}>
        <MatchListView />
      </Suspense>
    </main>
  )
}
