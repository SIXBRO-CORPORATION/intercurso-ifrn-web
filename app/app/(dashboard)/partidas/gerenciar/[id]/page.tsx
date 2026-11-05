import type { Metadata } from "next"
import { href } from "@/core/routes/route-registry"
import { MatchConsoleView } from "@/features/match/components/management/match-console-view"
import { BackButton } from "@/shared/components/back-button"

export const metadata: Metadata = { title: "Console da partida | Intercurso IFRN" }

export default async function ManageMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BackButton href={href("manageMatches")} />
      <MatchConsoleView id={id} />
    </div>
  )
}
