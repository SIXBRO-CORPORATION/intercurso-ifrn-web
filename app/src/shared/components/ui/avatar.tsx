import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const avatarVariants = cva("inline-grid shrink-0 place-items-center rounded-full font-bold uppercase", {
  variants: {
    tone: {
      success: "bg-primary-soft text-primary-dark",
      danger: "bg-danger-soft text-danger",
      warning: "bg-warning-soft text-warning-text",
      dark: "bg-ink text-white",
      inverse: "bg-white/20 text-white",
    },
    size: {
      sm: "size-8 text-xs",
      default: "size-10 text-base",
      lg: "size-14 text-xl",
    },
  },
  defaultVariants: {
    tone: "success",
    size: "default",
  },
})

function Avatar({
  name,
  tone,
  size,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & VariantProps<typeof avatarVariants> & { name?: string }) {
  return (
    <span aria-hidden data-slot="avatar" className={cn(avatarVariants({ tone, size }), className)} {...props}>
      {name?.trim().charAt(0) || "?"}
    </span>
  )
}

export { Avatar, avatarVariants }
