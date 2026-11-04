import type { Metadata } from "next"
import { MyTeamsView } from "@/features/team/components/my-teams-view"
import { BackButton } from "@/shared/components/back-button"

export const metadata: Metadata = { title: "Minhas equipes | Intercurso IFRN" }

export default function EquipesPage() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <BackButton href="/dashboard/equipes" />
            <MyTeamsView />
        </div>
    )
}
