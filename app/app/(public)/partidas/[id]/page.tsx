import type { Metadata } from "next"
import { MatchDetailView } from "@/features/match/components/match-detail-view"

export const metadata: Metadata = { title: "Partida | Intercurso IFRN" }

export default async function PartidaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-xl">
      <MatchDetailView id={id} />
    </div>
  )
}
