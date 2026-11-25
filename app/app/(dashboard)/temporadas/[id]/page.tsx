import type { Metadata } from "next"
import { SeasonDetailView } from "@/features/season/components/season-detail-view"

export const metadata: Metadata = { title: "Temporada | Intercurso IFRN" }

export default async function SeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SeasonDetailView id={id} />
}
