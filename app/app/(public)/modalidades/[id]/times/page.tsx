import type { Metadata } from "next"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { ModalityBackButton } from "@/features/modality/components/modality-back-button"
import { ModalityTeamsView } from "@/features/modality/components/modality-teams-view"

export const metadata: Metadata = { title: "Times da modalidade | Intercurso IFRN" }

export default async function ModalityTeamsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
            <ModalityBackButton fallbackHref="/modalidades" />
            <AuthGuard>
                <ModalityTeamsView modalityId={id} />
            </AuthGuard>
        </main>
    )
}