"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
      {result.status === "loading" && <MatchListLoading />}
      {result.status === "error" && (
        <MatchListMessage alert title="Não foi possível carregar as partidas.">
          <Button variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button>
        </MatchListMessage>
      )}
      {result.status === "success" && (
        <>
          {result.page.items.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.page.items.map((m) => (
                <li key={m.match_id}>
                  <MatchCard match={m} />
                </li>
              ))}
            </ul>
          ) : (
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
