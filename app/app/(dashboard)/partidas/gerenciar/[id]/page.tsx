import type { Metadata } from "next"
import { MatchConsoleView } from "@/features/match/components/management/match-console-view"

export const metadata: Metadata = { title: "Console da partida | Intercurso IFRN" }

export default async function ManageMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MatchConsoleView id={id} />
}
