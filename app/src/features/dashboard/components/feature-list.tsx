import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { RevealItem } from "@/shared/components/reveal-item"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import type { Feature, Role } from "../constants/sections"

const WHO: Record<Role, string> = { USER: "Aluno", MONITOR: "Monitor", ADMIN: "Admin" }

export function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {features.map((f, i) => (
        <RevealItem key={f.name} index={i}>
          <Card
            className={cn(
              "relative flex h-full flex-col gap-2 p-5",
              f.href && "pr-12 transition-colors focus-within:ring-3 focus-within:ring-ring/40 hover:border-primary",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="type-section text-ink">
                {f.href ? (
                  <Link href={f.href} className="outline-none after:absolute after:inset-0 after:rounded-lg">
                    {f.name}
                  </Link>
                ) : (
                  f.name
                )}
              </h3>
              <Badge variant={f.role === "USER" ? "success" : "dark"}>{WHO[f.role]}</Badge>
            </div>
            <p className="type-body-sm text-muted-foreground">{f.description}</p>
            {f.uc && <p className="type-caption text-primary-dark">Spec {f.uc}</p>}
            {f.href && <ChevronRight className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-faint" aria-hidden />}
          </Card>
        </RevealItem>
      ))}
    </ul>
  )
}
