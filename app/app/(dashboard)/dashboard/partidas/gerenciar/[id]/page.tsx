import type { Metadata } from "next"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { MANAGE_PATH } from "@/features/match/constants"
import { MatchConsoleView } from "@/features/match/components/management/match-console-view"
import { BackButton } from "@/shared/components/back-button"

export const metadata: Metadata = { title: "Console da partida | Intercurso IFRN" }

export default async function ManageMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BackButton href={MANAGE_PATH} />
      <AuthGuard roles={["MONITOR"]}>
        <MatchConsoleView id={id} />
      </AuthGuard>
    </div>
  )
}
