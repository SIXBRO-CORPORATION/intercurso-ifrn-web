import * as React from "react"
import { cn } from "cn"

type RevealItemProps = React.ComponentProps<"li"> & { index?: number }

export function RevealItem({ index = 0, className, style, ...props }: RevealItemProps) {
  return (
    <li
      className={cn(
        "fill-mode-both motion-safe:animate-in motion-safe:duration-400 motion-safe:fade-in motion-safe:slide-in-from-bottom-[14px]",
        className,
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, ...style }}
      {...props}
    />
  )
}
