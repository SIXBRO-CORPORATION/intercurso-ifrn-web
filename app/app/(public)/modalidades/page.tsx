import type { Metadata } from "next"
import { ModalityListView } from "@/features/modality/components/modality-list-view"

export const metadata: Metadata = { title: "Modalidades | Intercurso IFRN" }

export default function ModalidadesPage() {
    return <ModalityListView />
}
