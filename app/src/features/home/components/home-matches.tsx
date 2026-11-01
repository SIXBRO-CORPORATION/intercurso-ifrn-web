"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { MatchCard } from "@/features/match/components/match-card"
import { MatchListLoading, MatchListMessage } from "@/features/match/components/match-list-states"
import { useMatches } from "@/features/match/hooks/use-matches"
import { RevealItem } from "@/shared/components/reveal-item"
import { HOME_MATCHES_FILTERS } from "../constants"

export function HomeMatches({ seasonId }: { seasonId: string }) {
  const result = useMatches({ ...HOME_MATCHES_FILTERS, season_id: seasonId })

  return (
    <section aria-labelledby="home-matches" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 id="home-matches" className="type-h2 text-ink">Partidas</h2>
        <Link href="/partidas" className="type-body-sm inline-flex items-center gap-1 rounded-md font-bold text-primary-dark outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40">
          Ver todas <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      {result.status === "loading" && <MatchListLoading />}
      {result.status === "error" && <MatchListMessage alert title="Não foi possível carregar as partidas." />}
      {result.status === "success" &&
        (result.page.items.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.page.items.map((m, i) => (
              <RevealItem key={m.match_id} index={i}>
                <MatchCard match={m} />
              </RevealItem>
            ))}
          </ul>
        ) : (
          <MatchListMessage title="Ainda não há partidas.">Os jogos aparecem aqui assim que forem criados.</MatchListMessage>
        ))}
    </section>
  )
}
