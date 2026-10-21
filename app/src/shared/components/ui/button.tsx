import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-transparent text-base font-bold whitespace-nowrap transition duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.97] active:opacity-90 disabled:pointer-events-none disabled:border-transparent disabled:bg-field disabled:bg-none disabled:text-faint disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-primary to-primary-dark text-primary-foreground shadow-primary hover:brightness-105",
        outline: "border-primary bg-transparent text-primary hover:bg-primary-soft",
        soft: "bg-primary-soft text-primary-dark hover:bg-primary-muted/60",
        neutral: "bg-field text-ink hover:bg-border",
        danger: "bg-danger text-white hover:brightness-110",
        "danger-soft": "bg-danger-soft text-danger hover:brightness-95",
        warning: "bg-warning-soft text-warning-text hover:brightness-95",
        dark: "bg-ink text-white hover:bg-ink/90",
        ghost: "text-ink hover:bg-field",
        link: "rounded-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-14 px-8",
        sm: "h-10 px-4 text-sm",
        icon: "size-11",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
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
