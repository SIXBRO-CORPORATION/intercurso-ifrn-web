import type { Metadata } from "next"
import { ModalityBackButton } from "@/features/modality/components/modality-back-button"
import { ModalityListView } from "@/features/modality/components/modality-list-view"
import { PageHeader } from "@/shared/components/page-header"

export const metadata: Metadata = { title: "Modalidades | Intercurso IFRN" }

export default function ModalidadesPage() {
    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-10">
            <ModalityBackButton fallbackHref="/dashboard/modalidades" />
            <PageHeader
                title="Modalidades"
                description="Conheça os esportes do Intercurso e as regras de composição de cada time."
            />
            <ModalityListView />
        </main>
    )
}