import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent font-semibold whitespace-nowrap transition duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary font-bold text-primary-foreground hover:bg-primary-hover",
        secondary: "border-input text-foreground hover:border-foreground",
        ghost: "text-text-secondary hover:bg-muted hover:text-foreground",
        danger: "bg-destructive text-destructive-foreground hover:brightness-110",
        "danger-ghost": "text-danger-text hover:bg-danger-soft",
      },
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-7 rounded-sm px-2.5 text-xs",
        lg: "h-11 px-5 text-base",
        icon: "size-9",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
