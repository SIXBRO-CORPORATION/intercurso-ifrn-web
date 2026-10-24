"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LiveDot } from "@/shared/components/live-dot"
import { RevealItem } from "@/shared/components/reveal-item"
import { Button } from "@/shared/components/ui/button"
import { useMatches } from "../hooks/use-matches"
import type { Match, MatchFilters } from "../types/match"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { groupByModality, modalityOptions, splitLive } from "../utils/match-groups"
import { LiveMatchCard } from "./live-match-card"
import { MatchFiltersBar } from "./match-filters-bar"
import { MatchListLoading, MatchListMessage } from "./match-list-states"
import { MatchPagination } from "./match-pagination"
import { ModalitySection } from "./modality-section"

function MatchGroups({ items }: { items: Match[] }) {
  const { live, rest } = splitLive(items)
  return (
    <div className="space-y-6">
      {live.length > 0 && (
        <section aria-labelledby="live-now" className="space-y-3">
          <h2 id="live-now" className="type-overline inline-flex items-center gap-2 px-1 text-primary-dark">
            <LiveDot className="text-primary" /> Ao vivo agora
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {live.map((m, i) => (
              <RevealItem key={m.match_id} index={i}>
                <LiveMatchCard match={m} />
              </RevealItem>
            ))}
          </ul>
        </section>
      )}
      {groupByModality(rest).map((group) => (
        <ModalitySection key={group.modality_id} group={group} />
      ))}
    </div>
  )
}

// A temporada é sempre a ativa; só os demais filtros vivem na URL.
export function MatchList({ seasonId }: { seasonId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const filters = { ...parseFilters(new URLSearchParams(params)), season_id: seasonId }
  const result = useMatches(filters)

  function update(patch: Partial<MatchFilters>) {
    const query = toQuery({ ...withFilters(filters, patch), season_id: "" }, true).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <MatchFiltersBar filters={filters} modalities={result.status === "success" ? modalityOptions(result.page.items) : []} onChange={update} />
      {result.status === "loading" && <MatchListLoading />}
      {result.status === "error" && (
        <MatchListMessage alert title="Não foi possível carregar as partidas.">
          <Button variant="danger" onClick={() => window.location.reload()}>Tentar novamente</Button>
        </MatchListMessage>
      )}
      {result.status === "success" && (
        <>
          {result.page.items.length ? <MatchGroups items={result.page.items} /> : (
            <MatchListMessage title="Nenhuma partida encontrada.">Ajuste ou limpe os filtros para ver mais jogos.</MatchListMessage>
          )}
          {result.page.total > 0 && (
            <MatchPagination page={result.page.page} size={result.page.size} total={result.page.total} onPage={(page) => update({ page })} />
          )}
        </>
      )}
    </div>
  )
}
