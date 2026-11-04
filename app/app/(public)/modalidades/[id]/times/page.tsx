import type { Metadata } from "next"
import { href } from "@/core/routes/route-registry"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { TeamListView } from "@/features/team/components/team-list-view"
import { BackButton } from "@/shared/components/back-button"

export const metadata: Metadata = { title: "Times da modalidade | Intercurso IFRN" }

export default async function ModalityTeamsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
            <BackButton href={href("modalities")} />
            <AuthGuard>
                <TeamListView modalityId={id} />
            </AuthGuard>
        </main>
    )
}
