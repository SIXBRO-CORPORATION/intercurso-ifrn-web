import { Button } from "@/shared/components/ui/button"
import { fieldClass } from "@/shared/components/ui/field-class"
import { STATUS_OPTIONS } from "../constants"
import type { MatchFilters } from "../types/match"

type Props = { filters: MatchFilters; onChange: (patch: Partial<MatchFilters>) => void }

const label = "flex flex-col gap-1 text-xs font-medium text-brand-800 sm:w-48"

export function MatchFiltersBar({ filters, onChange }: Props) {
  const active = !!(filters.status || filters.date_from || filters.date_to)
  return (
    <form role="search" aria-label="Filtrar partidas" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-end gap-3">
      <label className={label}>
        Status
        <select className={fieldClass} value={filters.status} onChange={(e) => onChange({ status: e.target.value as MatchFilters["status"] })}>
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        De
        <input type="date" className={fieldClass} value={filters.date_from} max={filters.date_to || undefined} onChange={(e) => onChange({ date_from: e.target.value })} />
      </label>
      <label className={label}>
        Até
        <input type="date" className={fieldClass} value={filters.date_to} min={filters.date_from || undefined} onChange={(e) => onChange({ date_to: e.target.value })} />
      </label>
      {active && (
        <Button type="button" variant="ghost" size="lg" onClick={() => onChange({ status: "", date_from: "", date_to: "" })}>
          Limpar filtros
        </Button>
      )}
    </form>
  )
}
