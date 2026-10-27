"use client"

import { useActiveSeason } from "@/features/season"
import { Badge } from "@/shared/components/ui/badge"
import { ModalityList } from "./modality-list"
import { ModalityListLoading } from "./modality-list-states"

export function ModalityListView() {
  const season = useActiveSeason()
  if (season.status === "loading") return <ModalityListLoading />

  const active = season.status === "success" ? season.season : null

  return (
    <div className="space-y-4">
      {active && <Badge variant="success">{active.name}</Badge>}
      <ModalityList seasonId={active?.season_id} />
    </div>
  )
}
