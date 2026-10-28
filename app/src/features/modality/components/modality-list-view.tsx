"use client"

import { useActiveSeason } from "@/features/season"
import { GridSkeleton } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { MODALITIES_LOADING_LABEL, ModalityList } from "./modality-list"

export function ModalityListView() {
    const season = useActiveSeason()
    if (season.status === "loading") return <GridSkeleton label={MODALITIES_LOADING_LABEL} />

    const active = season.status === "success" ? season.season : null

    return (
        <div className="space-y-4">
            {active && <Badge variant="success">{active.name}</Badge>}
            <ModalityList seasonId={active?.season_id} />
        </div>
    )
}
