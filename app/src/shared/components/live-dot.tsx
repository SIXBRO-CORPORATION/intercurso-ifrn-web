import { cn } from "cn"

export function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-1.5 shrink-0 rounded-full bg-current motion-safe:animate-pulse", className)} />
}
