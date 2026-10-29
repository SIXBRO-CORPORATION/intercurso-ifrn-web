"use client"

import type { Modality } from "@/features/modality"
import { Button } from "@/shared/components/ui/button"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { fieldClass } from "@/shared/components/ui/field-class"
import type { MatchFilters } from "../types/match"

type Props = {
  filters: MatchFilters
  modalities: Modality[]
  onChange: (patch: Partial<MatchFilters>) => void
}

const label = "type-label flex flex-col gap-1 text-muted-foreground"

export function MonitorMatchFilters({ filters, modalities, onChange }: Props) {
  const active = !!(filters.modality_id || filters.date_from || filters.date_to)

  return (
    <form role="search" aria-label="Filtrar partidas" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-end gap-3">
      <label className={`${label} sm:w-64`}>
        Modalidade
        <select className={fieldClass} value={filters.modality_id} onChange={(e) => onChange({ modality_id: e.target.value })}>
          <option value="">Todas as modalidades</option>
          {modalities.map((m) => (
            <option key={m.modality_id} value={m.modality_id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <label className={`${label} sm:w-48`}>
        De
        <DatePicker value={filters.date_from} max={filters.date_to || undefined} onChange={(value) => onChange({ date_from: value })} />
      </label>
      <label className={`${label} sm:w-48`}>
        Até
        <DatePicker value={filters.date_to} min={filters.date_from || undefined} onChange={(value) => onChange({ date_to: value })} />
      </label>
      {active && (
        <Button type="button" variant="ghost" onClick={() => onChange({ modality_id: "", date_from: "", date_to: "" })}>
          Limpar filtros
        </Button>
      )}
    </form>
  )
}
