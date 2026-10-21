import { Button } from "@/shared/components/ui/button"
import { Chip } from "@/shared/components/ui/chip"
import { fieldClass } from "@/shared/components/ui/field-class"
import { STATUS_OPTIONS } from "../constants"
import type { MatchFilters } from "../types/match"

type Props = { filters: MatchFilters; onChange: (patch: Partial<MatchFilters>) => void }

const label = "type-label flex flex-col gap-1 text-muted-foreground sm:w-48"

export function MatchFiltersBar({ filters, onChange }: Props) {
  const active = !!(filters.status || filters.date_from || filters.date_to)
  return (
    <form role="search" aria-label="Filtrar partidas" onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
        <Chip selected={!filters.status} onClick={() => onChange({ status: "" })}>Todos</Chip>
        {STATUS_OPTIONS.map((o) => (
          <Chip key={o.value} selected={filters.status === o.value} onClick={() => onChange({ status: o.value })}>
            {o.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className={label}>
          De
          <input type="date" className={fieldClass} value={filters.date_from} max={filters.date_to || undefined} onChange={(e) => onChange({ date_from: e.target.value })} />
        </label>
        <label className={label}>
          Até
          <input type="date" className={fieldClass} value={filters.date_to} min={filters.date_from || undefined} onChange={(e) => onChange({ date_to: e.target.value })} />
        </label>
        {active && (
          <Button type="button" variant="ghost" onClick={() => onChange({ status: "", date_from: "", date_to: "" })}>
            Limpar filtros
          </Button>
        )}
      </div>
    </form>
  )
}
