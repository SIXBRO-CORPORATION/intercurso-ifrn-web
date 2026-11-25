"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, CircleDot, SlidersHorizontal } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Chip } from "@/shared/components/ui/chip"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { STATUS_OPTIONS } from "../constants"
import { matchFiltersFormSchema, type MatchFiltersForm } from "../schemas/match-filters-schema"
import type { MatchFilters } from "../types/match"
import { dayLabel, shiftDay } from "../utils/match-filters"

type Props = { filters: MatchFilters; onChange: (patch: Partial<MatchFilters>) => void }

const CLEARED = { status: "", date_from: "", date_to: "" } as const
const label = "type-small flex flex-col gap-1.5 font-semibold text-text-secondary"

function FilterForm({ filters, onChange }: Props) {
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
      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
      {errors.date_to && (
        <p role="alert" className="type-small text-danger-text">{errors.date_to.message}</p>
      )}
    </form>
  )
}

export function MatchFiltersBar({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const live = filters.status === "IN_PROGRESS"
  const activeCount = [filters.status, filters.date_from, filters.date_to].filter(Boolean).length
  const today = new Date()
  const hasDate = !!(filters.date_from || filters.date_to)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" className="bg-muted text-foreground hover:bg-selected" onClick={() => setOpen(true)}>
        <SlidersHorizontal aria-hidden /> Filtro
        {activeCount > 0 && (
          <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-foreground px-1 text-[0.6875rem] font-bold text-background">
            {activeCount}
            <span className="sr-only"> ativos</span>
          </span>
        )}
      </Button>
      <Button
        variant="ghost"
        aria-pressed={live}
        className="border-live text-live hover:text-live aria-pressed:bg-live aria-pressed:text-background"
        onClick={() => onChange(live ? { status: "" } : { ...CLEARED, status: "IN_PROGRESS" })}
      >
        Ao vivo <CircleDot aria-hidden />
      </Button>
      <div className="flex min-w-48 flex-1 items-center rounded-full bg-muted px-1">
        <Button variant="ghost" size="icon-sm" aria-label="Dia anterior" onClick={() => onChange(shiftDay(filters, -1, today))}>
          <ChevronLeft aria-hidden />
        </Button>
        <button
          type="button"
          title={hasDate ? "Ver todas as datas" : "Ver partidas de hoje"}
          onClick={() => onChange(hasDate ? { date_from: "", date_to: "" } : shiftDay(filters, 0, today))}
          className="h-9 min-w-0 flex-1 truncate rounded-full text-[0.8125rem] font-semibold outline-none first-letter:uppercase focus-visible:ring-3 focus-visible:ring-ring"
        >
          {dayLabel(filters, today)}
        </button>
        <Button variant="ghost" size="icon-sm" aria-label="Próximo dia" onClick={() => onChange(shiftDay(filters, 1, today))}>
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Filtro</DialogTitle>
          <DialogDescription>Os filtros são aplicados assim que você escolhe.</DialogDescription>
          <FilterForm filters={filters} onChange={onChange} />
          <DialogFooter>
            <Button variant="ghost" disabled={!activeCount} onClick={() => onChange(CLEARED)}>
              Limpar filtros
            </Button>
            <Button onClick={() => setOpen(false)}>Concluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
