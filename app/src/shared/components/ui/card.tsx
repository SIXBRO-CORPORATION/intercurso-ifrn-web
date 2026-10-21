import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const cardVariants = cva("", {
  variants: {
    variant: {
      surface: "rounded-lg border border-border bg-card shadow-card",
      field: "rounded-md bg-field",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
})

function Card({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return <Comp data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
}

export { Card, cardVariants }
