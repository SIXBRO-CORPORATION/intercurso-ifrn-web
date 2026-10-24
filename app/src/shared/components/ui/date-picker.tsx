"use client"

import { useState } from "react"
import { cn } from "cn"
import { CalendarDays } from "lucide-react"
import { formatBrDate, parseIsoDate, toIsoDate } from "@/lib/iso-date"
import { Calendar } from "./calendar"
import { fieldClass } from "./field-class"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type Props = {
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, min, max, placeholder = "dd/mm/aaaa", className }: Props) {
  const [open, setOpen] = useState(false)
  const selected = parseIsoDate(value)
  const minDate = min ? parseIsoDate(min) : undefined
  const maxDate = max ? parseIsoDate(max) : undefined
  const disabled = [minDate && { before: minDate }, maxDate && { after: maxDate }].filter((m) => !!m)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={cn(fieldClass, "flex cursor-pointer items-center justify-between gap-2 text-left", !selected && "text-faint", className)}>
          <span className="truncate">{selected ? formatBrDate(selected) : placeholder}</span>
          <CalendarDays aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          autoFocus
          selected={selected}
          defaultMonth={selected ?? maxDate ?? minDate}
          disabled={disabled}
          onSelect={(date) => {
            onChange(date ? toIsoDate(date) : "")
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
