import { Avatar } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"

const ROLE_LABELS: Record<string, string> = { USER: "Aluno", MONITOR: "Monitor", ADMIN: "Admin" }

export function UserChip({ name, role = "USER" }: { name?: string; role?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar name={name} tone="brand" />
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className="max-w-full truncate font-bold">{name}</span>
        <Badge>{ROLE_LABELS[role] ?? role}</Badge>
      </span>
    </span>
  )
}
