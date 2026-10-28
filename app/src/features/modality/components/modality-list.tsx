"use client"

import { EmptyState, ErrorState, GridSkeleton } from "@/shared/components/request-states"
import { useModalities } from "../hooks/use-modalities"
import { ModalityCard } from "./modality-card"

export const MODALITIES_LOADING_LABEL = "Carregando modalidades…"

export function ModalityList({ seasonId }: { seasonId?: string }) {
    const modalities = useModalities(seasonId)

    if (modalities.isPending) return <GridSkeleton label={MODALITIES_LOADING_LABEL} />
    if (modalities.isError) {
        return (
            <ErrorState
                title="Não foi possível carregar as modalidades."
                description="Verifique sua conexão e tente novamente."
                onRetry={() => modalities.refetch()}
            />
        )
    }
    if (modalities.data.length === 0) {
        return <EmptyState title="Nenhuma modalidade ativa." description="Ainda não há modalidades abertas para esta temporada." />
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modalities.data.map((modality) => (
                <li key={modality.modality_id}>
                    <ModalityCard modality={modality} />
                </li>
            ))}
        </ul>
    )
}
