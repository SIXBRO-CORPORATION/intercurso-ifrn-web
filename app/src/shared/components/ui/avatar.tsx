import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Avatar as AvatarPrimitive } from "radix-ui"

const avatarVariants = cva("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold uppercase", {
  variants: {
    tone: {
      crest: "bg-crest text-text-secondary",
      brand: "bg-primary-soft text-primary-text",
    },
    size: {
      xs: "size-5 text-[0.5625rem]",
      sm: "size-8 text-xs",
      default: "size-9 text-sm",
      lg: "size-14 text-xl",
    },
  },
  defaultVariants: {
    tone: "crest",
    size: "default",
  },
})

const initials = (name: string | undefined) =>
  name?.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("") || "?"

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants> & {
  /** Atalho: iniciais do nome como fallback e, se houver `src`, a imagem por cima. */
  name?: string
  src?: string | null
}

function Avatar({ name, src, tone, size, className, children, ...props }: AvatarProps) {
  return (
      <AvatarPrimitive.Root aria-hidden data-slot="avatar" className={cn(avatarVariants({ tone, size }), className)} {...props}>
        {children ?? (
            <>
              {src && <AvatarImage src={src} />}
              <AvatarFallback>{initials(name)}</AvatarFallback>
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

export { Avatar, AvatarImage, AvatarFallback }
