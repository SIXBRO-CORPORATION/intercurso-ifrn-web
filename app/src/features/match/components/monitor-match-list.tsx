"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useModalities } from "@/features/modality"
import { ErrorState, EmptyState } from "@/shared/components/request-states"
import { RevealItem } from "@/shared/components/reveal-item"
import { MAX_PAGE_SIZE } from "../constants"
import { useMatches } from "../hooks/use-matches"
import type { Match, MatchFilters } from "../types/match"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { MatchListLoading } from "./match-list-states"
import { MatchPagination } from "./match-pagination"
import { MonitorMatchFilters } from "./monitor-match-filters"
import { LiveMatchRow, ScheduledMatchRow } from "./monitor-match-row"
import { StartMatchDialog } from "./start-match-dialog"

export function MonitorMatchList({ seasonId }: { seasonId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [starting, setStarting] = useState<Match | null>(null)
  const parsed = parseFilters(new URLSearchParams(params))
  const filters: MatchFilters = { ...parsed, season_id: seasonId, status: "SCHEDULED" }
  const liveFilters: MatchFilters = { ...filters, status: "IN_PROGRESS", modality_id: "", date_from: "", date_to: "", page: 1, size: MAX_PAGE_SIZE }

  const scheduled = useMatches(filters)
  const live = useMatches(liveFilters)
  const modalities = useModalities(seasonId)

  function update(patch: Partial<MatchFilters>) {
    const query = toQuery({ ...withFilters(filters, patch), season_id: "", status: "" }, true).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const liveItems = live.data?.items ?? []

  return (
    <div className="space-y-8">
      {live.isError && <ErrorState title="Não foi possível carregar as partidas em andamento." onRetry={() => live.refetch()} />}
      {liveItems.length > 0 && (
        <section aria-labelledby="live-title" className="space-y-3">
          <h2 id="live-title" className="type-section text-ink">
            Em andamento
          </h2>
          <ul className="space-y-3">
            {liveItems.map((m) => (
              <RevealItem key={m.match_id}>
                <LiveMatchRow match={m} />
              </RevealItem>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="scheduled-title" className="space-y-4">
        <h2 id="scheduled-title" className="type-section text-ink">
          Agendadas
        </h2>
        <MonitorMatchFilters filters={filters} modalities={modalities.data ?? []} onChange={update} />
        {scheduled.isPending && <MatchListLoading />}
        {scheduled.isError && <ErrorState title="Não foi possível carregar as partidas." onRetry={() => scheduled.refetch()} />}
        {scheduled.isSuccess && (
          <>
            {scheduled.data.items.length ? (
              <ul className="space-y-3">
                {scheduled.data.items.map((m, i) => (
                  <RevealItem key={m.match_id} index={i}>
                    <ScheduledMatchRow match={m} onStart={setStarting} />
                  </RevealItem>
                ))}
              </ul>
            ) : (
              <EmptyState title="Nenhuma partida agendada." description="Ajuste ou limpe os filtros para ver mais jogos." />
            )}
            {scheduled.data.total > 0 && (
              <MatchPagination
                page={scheduled.data.page}
                size={scheduled.data.size}
                total={scheduled.data.total}
                onPage={(page) => update({ page })}
              />
            )}
          </>
        )}
      </section>

      {starting && <StartMatchDialog match={starting} liveMatches={liveItems} onClose={() => setStarting(null)} />}
    </div>
  )
}
