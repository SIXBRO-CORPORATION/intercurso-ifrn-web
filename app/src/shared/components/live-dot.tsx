import { cn } from "cn"

export function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-2", className)}>
      <span className="absolute inline-flex size-full rounded-full bg-current opacity-35 motion-safe:animate-ping [animation-duration:1s]" />
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  )
}
