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
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-semibold whitespace-nowrap transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring",
        selected ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-selected",
        className,
      )}
      {...props}
    />
  )
}

export { Chip }
