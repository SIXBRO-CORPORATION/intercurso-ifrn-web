import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-field text-muted-foreground",
        success: "bg-primary-soft text-primary-dark",
        danger: "bg-danger-soft text-danger",
        warning: "bg-warning-soft text-warning-text",
        dark: "bg-ink text-white",
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
