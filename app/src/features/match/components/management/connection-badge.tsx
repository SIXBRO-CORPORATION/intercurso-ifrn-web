import type { RealtimeStatus } from "@/core/realtime/types"
import { LiveDot } from "@/shared/components/live-dot"
import { Badge } from "@/shared/components/ui/badge"

const STATES: Record<RealtimeStatus, { label: string; variant: "success" | "warning" | "neutral"; dot: boolean }> = {
  open: { label: "Conectado", variant: "success", dot: true },
  connecting: { label: "Conectando…", variant: "warning", dot: false },
  reconnecting: { label: "Reconectando…", variant: "warning", dot: false },
  closed: { label: "Desconectado", variant: "neutral", dot: false },
}

export function ConnectionBadge({ status }: { status: RealtimeStatus }) {
  const { label, variant, dot } = STATES[status]
  return (
    <Badge variant={variant} role="status" aria-label={`Tempo real: ${label}`}>
      {dot && <LiveDot />}
      {label}
    </Badge>
  )
}
