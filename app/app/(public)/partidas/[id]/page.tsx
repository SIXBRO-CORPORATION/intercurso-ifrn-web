import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MatchDetailView } from "@/features/match/components/match-detail-view"

export const metadata: Metadata = { title: "Partida | Intercurso IFRN" }

export default async function PartidaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-10">
      <Link href="/partidas" className="type-label inline-flex items-center gap-1.5 text-primary-dark">
        <ArrowLeft className="size-4" aria-hidden /> Partidas
      </Link>
      <MatchDetailView id={id} />
    </main>
  )
}
