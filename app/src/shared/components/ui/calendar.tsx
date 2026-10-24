"use client"

import * as React from "react"
import { cn } from "cn"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"
import { buttonVariants } from "./button"

function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames()
  const nav = cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-9 p-0 select-none aria-disabled:opacity-40", )

  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", d.root),
        months: cn("relative flex flex-col gap-4", d.months),
        month: cn("flex w-full flex-col gap-3", d.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between", d.nav),
        button_previous: cn(nav, d.button_previous),
        button_next: cn(nav, d.button_next),
        month_caption: cn("flex h-9 items-center justify-center", d.month_caption),
        caption_label: cn("text-sm font-bold capitalize", d.caption_label),
        month_grid: "w-full border-collapse",
        weekdays: cn("flex", d.weekdays),
        weekday: cn("w-10 text-center text-xs font-medium text-muted-foreground capitalize", d.weekday),
        week: cn("mt-1 flex w-full", d.week),
        day: cn("size-10 p-0 text-center text-sm", d.day),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-10 p-0 text-sm font-medium active:scale-100",
          d.day_button,
        ),
        today: cn("[&>button]:border-primary", d.today),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:brightness-105",
          d.selected,
        ),
        outside: cn("[&>button]:text-faint", d.outside),
        disabled: cn("[&>button]:pointer-events-none [&>button]:opacity-35", d.disabled),
        hidden: cn("invisible", d.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) =>
          orientation === "left" ? <ChevronLeft className={cn("size-4", c)} /> : <ChevronRight className={cn("size-4", c)} />,
      }}
      {...props}
    />
  )
}

export { Calendar }
