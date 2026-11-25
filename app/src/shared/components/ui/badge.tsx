import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full px-2 text-[0.6875rem] font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-text-secondary",
        success: "bg-primary-soft text-primary-text",
        warning: "bg-warning-soft text-warning-text",
        danger: "bg-danger-soft text-danger-text",
        live: "bg-destructive tracking-wider text-destructive-foreground uppercase",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
