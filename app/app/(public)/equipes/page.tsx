import type { Metadata } from "next"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { MyTeamsView } from "@/features/team/components/my-teams-view"
import { BackButton } from "@/shared/components/back-button"

export const metadata: Metadata = { title: "Minhas equipes | Intercurso IFRN" }

export default function EquipesPage() {
    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
            <BackButton href="/dashboard/equipes" />
            <AuthGuard>
                <MyTeamsView />
            </AuthGuard>
        </main>
    )
}