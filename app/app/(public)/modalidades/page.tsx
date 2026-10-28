import type { Metadata } from "next"
import { ModalityListView } from "@/features/modality/components/modality-list-view"
import { BackButton } from "@/shared/components/back-button"
import { PageHeader } from "@/shared/components/page-header"

export const metadata: Metadata = { title: "Modalidades | Intercurso IFRN" }

export default function ModalidadesPage() {
    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
            <BackButton href="/dashboard/modalidades" />
            <PageHeader
                title="Modalidades"
                description="Conheça os esportes do Intercurso e as regras de composição de cada time."
            />
            <ModalityListView />
        </main>
    )
}
