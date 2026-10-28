"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RevealItem } from "@/shared/components/reveal-item"
import { Button } from "@/shared/components/ui/button"
import { useMatches } from "../hooks/use-matches"
import type { MatchFilters } from "../types/match"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { MatchCard } from "./match-card"
import { MatchFiltersBar } from "./match-filters-bar"
import { MatchListLoading, MatchListMessage } from "./match-list-states"
import { MatchPagination } from "./match-pagination"

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
      <MatchFiltersBar filters={filters} onChange={update} />
      {result.isPending && <MatchListLoading />}
      {result.isError && (
        <MatchListMessage alert title="Não foi possível carregar as partidas.">
          <Button variant="danger" onClick={() => result.refetch()}>Tentar novamente</Button>
        </MatchListMessage>
      )}
      {result.isSuccess && (
        <>
          {result.data.items.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.items.map((m, i) => (
                <RevealItem key={m.match_id} index={i}>
                  <MatchCard match={m} />
                </RevealItem>
              ))}
            </ul>
          ) : (
            <MatchListMessage title="Nenhuma partida encontrada.">Ajuste ou limpe os filtros para ver mais jogos.</MatchListMessage>
          )}
          {result.data.total > 0 && (
            <MatchPagination page={result.data.page} size={result.data.size} total={result.data.total} onPage={(page) => update({ page })} />
          )}
        </>
      )}
    </div>
  )
}
