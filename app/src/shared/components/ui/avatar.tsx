import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Avatar as AvatarPrimitive } from "radix-ui"

const avatarVariants = cva("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold uppercase", {
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

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants> & {
  /** Atalho: inicial do nome como fallback e, se houver `src`, a imagem por cima. */
  name?: string
  src?: string | null
}

function Avatar({ name, src, tone, size, className, children, ...props }: AvatarProps) {
  return (
      <AvatarPrimitive.Root aria-hidden data-slot="avatar" className={cn(avatarVariants({ tone, size }), className)} {...props}>
        {children ?? (
            <>
              {src && <AvatarImage src={src} />}
              <AvatarFallback>{name?.trim().charAt(0) || "?"}</AvatarFallback>
            </>
        )}
      </AvatarPrimitive.Root>
  )
}

function AvatarImage({ className, alt = "", ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" alt={alt} className={cn("aspect-square size-full object-cover", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn("grid size-full place-items-center", className)} {...props} />
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
