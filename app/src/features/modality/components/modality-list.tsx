"use client"

import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Card } from "@/shared/components/ui/card"
import { useModalities } from "../hooks/use-modalities"
import { ModalityCard } from "./modality-card"

export const MODALITIES_LOADING_LABEL = "Carregando modalidades…"

export function ModalityList({ seasonId }: { seasonId?: string }) {
    const modalities = useModalities(seasonId)

    if (modalities.isPending) return <ListSkeleton label={MODALITIES_LOADING_LABEL} />
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
        <Card asChild>
            <ul className="divide-y divide-border">
                {modalities.data.map((modality) => (
                    <li key={modality.modality_id}>
                        <ModalityCard modality={modality} />
                    </li>
                ))}
            </ul>
        </Card>
    )
}
