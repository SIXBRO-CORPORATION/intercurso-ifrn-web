import { CalendarDays } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Chip } from "@/shared/components/ui/chip"
import { fieldClass } from "@/shared/components/ui/field-class"
import { segmentedItem, segmentedList } from "@/shared/components/ui/segmented-class"
import { STATUS_TABS } from "../constants"
import type { MatchFilters } from "../types/match"
import type { ModalityOption } from "../utils/match-groups"

type Props = {
  filters: MatchFilters
  modalities: ModalityOption[]
  onChange: (patch: Partial<MatchFilters>) => void
}

const label = "type-label flex flex-col gap-1 text-muted-foreground sm:w-48"
const chip = "h-9 px-3.5"

export function MatchFiltersBar({ filters, modalities, onChange }: Props) {
  const dates = !!(filters.date_from || filters.date_to)
  const active = !!(filters.status || filters.modality_id || dates)
  return (
    <form role="search" aria-label="Filtrar partidas" onSubmit={(e) => e.preventDefault()} className="space-y-3">
      <div role="group" aria-label="Status" className={segmentedList}>
        {STATUS_TABS.map((o) => (
          <button
            key={o.value || "all"}
            type="button"
            aria-pressed={filters.status === o.value}
            className={segmentedItem}
            onClick={() => onChange({ status: o.value })}
          >
            {o.label}
          </button>
        ))}
      </div>
      {(modalities.length > 0 || !!filters.modality_id) && (
        <div role="group" aria-label="Modalidade" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
          <Chip className={chip} selected={!filters.modality_id} onClick={() => onChange({ modality_id: "" })}>
            Todas
          </Chip>
          {modalities.map((m) => (
            <Chip key={m.id} className={chip} selected={filters.modality_id === m.id} onClick={() => onChange({ modality_id: m.id })}>
              {m.name}
            </Chip>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <details open={dates || undefined} className="group">
          <summary className="type-label inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full px-3 text-muted-foreground outline-none hover:bg-field focus-visible:ring-3 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
            <CalendarDays className="size-4" aria-hidden /> Filtrar por data
          </summary>
          <div className="flex flex-wrap items-end gap-3 pt-3">
            <label className={label}>
              De
              <input type="date" className={fieldClass} value={filters.date_from} max={filters.date_to || undefined} onChange={(e) => onChange({ date_from: e.target.value })} />
            </label>
            <label className={label}>
              Até
              <input type="date" className={fieldClass} value={filters.date_to} min={filters.date_from || undefined} onChange={(e) => onChange({ date_to: e.target.value })} />
            </label>
          </div>
        </details>
        {active && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ status: "", modality_id: "", date_from: "", date_to: "" })}>
            Limpar filtros
          </Button>
        )}
      </div>
    </form>
  )
}
