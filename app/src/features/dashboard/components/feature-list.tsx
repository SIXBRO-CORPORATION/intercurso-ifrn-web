import { cn } from "@/lib/utils"
import type { Feature, Role } from "../constants/sections"

const WHO: Record<Role, string> = { USER: "Aluno", MONITOR: "Monitor", ADMIN: "Admin" }

export function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {features.map((f) => (
        <li key={f.name} className="flex flex-col gap-1.5 rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-brand-900">{f.name}</h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                f.role === "USER" ? "bg-brand-100 text-brand-800" : "bg-neutral-900 text-white",
              )}
            >
              {WHO[f.role]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{f.description}</p>
          {f.uc && <p className="text-xs text-brand-700">Spec {f.uc}</p>}
        </li>
      ))}
    </ul>
  )
}
