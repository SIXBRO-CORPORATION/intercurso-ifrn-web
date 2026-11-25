import * as React from "react"
import { cn } from "cn"
import { Slot } from "radix-ui"

function Card({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return <Comp data-slot="card" className={cn("overflow-hidden rounded-lg bg-card", className)} {...props} />
}

/** Cabeçalho padrão de cartão: título à esquerda, ação opcional à direita. */
function CardHeader({ title, action, className }: { title: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div data-slot="card-header" className={cn("flex min-h-11 items-center justify-between gap-3 border-b border-border px-4", className)}>
      <h2 className="type-h3 min-w-0 truncate">{title}</h2>
      {action}
    </div>
  )
}

export { Card, CardHeader }
