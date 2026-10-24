import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MatchDetailView } from "@/features/match/components/match-detail-view"

export const metadata: Metadata = { title: "Partida | Intercurso IFRN" }

export default async function PartidaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-10">
      <Link href="/partidas" className="type-label inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-bold text-primary-dark outline-none hover:bg-primary-soft focus-visible:ring-3 focus-visible:ring-ring/40">
        <ArrowLeft className="size-4" aria-hidden /> Partidas
      </Link>
      <MatchDetailView id={id} />
    </main>
  )
}
