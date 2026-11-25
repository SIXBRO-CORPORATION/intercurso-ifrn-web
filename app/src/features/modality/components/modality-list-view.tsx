"use client"

import { useActiveSeason } from "@/features/season"
import { ListSkeleton } from "@/shared/components/request-states"
import { MODALITIES_LOADING_LABEL, ModalityList } from "./modality-list"

export function ModalityListView() {
    const season = useActiveSeason()
    if (season.isPending) return <ListSkeleton label={MODALITIES_LOADING_LABEL} />

    const active = season.data ?? null

    return (
        <div className="space-y-4">
            <p className="type-small text-text-secondary">
                {active ? `${active.name} · ` : ""}Esportes do Intercurso e as regras de composição de cada time.
            </p>
            <ModalityList seasonId={active?.season_id} />
        </div>
    )
}
