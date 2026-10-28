"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Chip } from "@/shared/components/ui/chip"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { STATUS_OPTIONS } from "../constants"
import { matchFiltersFormSchema, type MatchFiltersForm } from "../schemas/match-filters-schema"
import type { MatchFilters } from "../types/match"

type Props = { filters: MatchFilters; onChange: (patch: Partial<MatchFilters>) => void }

const label = "type-label flex flex-col gap-1 text-muted-foreground sm:w-48"

export function MatchFiltersBar({ filters, onChange }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchFiltersForm>({
    values: { status: filters.status, date_from: filters.date_from, date_to: filters.date_to },
    resolver: zodResolver(matchFiltersFormSchema),
  })
  const apply = handleSubmit((values) => onChange(values))
  const commit = (change: (value: string) => void, value: string) => {
    change(value)
    void apply()
  }
  const active = !!(filters.status || filters.date_from || filters.date_to)

  return (
    <form role="search" aria-label="Filtrar partidas" onSubmit={apply} className="space-y-4">
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
            <Chip selected={!field.value} onClick={() => commit(field.onChange, "")}>Todos</Chip>
            {STATUS_OPTIONS.map((o) => (
              <Chip key={o.value} selected={field.value === o.value} onClick={() => commit(field.onChange, o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
        )}
      />
      <div className="flex flex-wrap items-end gap-3">
        <Controller
          control={control}
          name="date_from"
          render={({ field }) => (
            <label className={label}>
              De
              <DatePicker value={field.value} max={filters.date_to || undefined} onChange={(v) => commit(field.onChange, v)} />
            </label>
          )}
        />
        <Controller
          control={control}
          name="date_to"
          render={({ field }) => (
            <label className={label}>
              Até
              <DatePicker value={field.value} min={filters.date_from || undefined} onChange={(v) => commit(field.onChange, v)} />
            </label>
          )}
        />
        {active && (
          <Button type="button" variant="ghost" onClick={() => onChange({ status: "", date_from: "", date_to: "" })}>
            Limpar filtros
          </Button>
        )}
      </div>
      {errors.date_to && (
        <p role="alert" className="text-sm text-destructive">{errors.date_to.message}</p>
      )}
    </form>
  )
}
