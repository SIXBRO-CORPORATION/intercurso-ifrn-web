import * as React from "react"
import { cn } from "cn"

function Chip({
  selected = false,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "type"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-slot="chip"
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.97]",
        selected ? "bg-primary text-primary-foreground" : "bg-field text-muted-foreground hover:bg-border",
        className,
      )}
      {...props}
    />
  )
}

export { Chip }
