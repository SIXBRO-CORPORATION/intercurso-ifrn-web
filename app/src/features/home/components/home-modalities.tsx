"use client"

import Link from "next/link"
import { useModalities } from "@/features/modality/hooks/use-modalities"
import { cn } from "@/lib/utils"

const chip =
  "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.97]"

// Cada modalidade leva à lista de partidas já filtrada (/partidas?modality_id=…).
export function HomeModalities({ seasonId }: { seasonId: string }) {
  const result = useModalities(seasonId)

  return (
    <section aria-labelledby="home-modalities" className="space-y-4">
      <h2 id="home-modalities" className="type-h2 text-ink">Modalidades</h2>
      {result.status === "loading" && (
        <div role="status" aria-busy="true" className="flex flex-wrap gap-2">
          <span className="sr-only">Carregando modalidades…</span>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} aria-hidden className="h-10 w-28 rounded-full bg-border/60 motion-safe:animate-pulse" />
          ))}
        </div>
      )}
      {result.status === "error" && <p role="alert" className="type-body-sm text-danger">Não foi possível carregar as modalidades.</p>}
      {result.status === "success" &&
        (result.items.length ? (
          <ul className="flex flex-wrap gap-2">
            {result.items.map((m) => (
              <li key={m.modality_id}>
                <Link href={`/partidas?modality_id=${encodeURIComponent(m.modality_id)}`} className={cn(chip, "bg-card text-ink shadow-sm hover:bg-primary-soft hover:text-primary-dark")}>
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-body-sm text-muted-foreground">Nenhuma modalidade cadastrada nesta temporada ainda.</p>
        ))}
    </section>
  )
}
