import type { Metadata } from "next"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { TeamListView } from "@/features/team/components/team-list-view"

export const metadata: Metadata = { title: "Times da modalidade | Intercurso IFRN" }

export default async function ModalityTeamsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <AuthGuard>
            <TeamListView modalityId={id} />
        </AuthGuard>
    )
}
