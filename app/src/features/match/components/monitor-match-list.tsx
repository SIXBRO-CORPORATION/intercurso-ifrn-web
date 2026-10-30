"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useModalities } from "@/features/modality"
import { cn } from "@/lib/utils"
import { ErrorState, EmptyState } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { MAX_PAGE_SIZE } from "../constants"
import { useMatches } from "../hooks/use-matches"
import { useMatchesLive } from "../hooks/use-matches-live"
import type { Match, MatchFilters, MatchStatus } from "../types/match"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { MatchListLoading } from "./match-list-states"
import { MatchPagination } from "./match-pagination"
import { MonitorMatchFilters } from "./monitor-match-filters"
import { FinishedMatchTable, LiveMatchTable, ScheduledMatchTable } from "./monitor-match-row"
import { StartMatchDialog } from "./start-match-dialog"

const TABS: { value: MatchStatus; label: string; empty: string }[] = [
  { value: "IN_PROGRESS", label: "Em andamento", empty: "Nenhuma partida em andamento." },
  { value: "SCHEDULED", label: "Agendadas", empty: "Nenhuma partida agendada." },
  { value: "FINISHED", label: "Encerradas", empty: "Nenhuma partida encerrada." },
]

export function MonitorMatchList({ seasonId }: { seasonId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [starting, setStarting] = useState<Match | null>(null)
  const parsed = parseFilters(new URLSearchParams(params))
  const tab = TABS.find((t) => t.value === parsed.status) ?? TABS[1]
  const filters: MatchFilters = { ...parsed, season_id: seasonId, status: tab.value }
  const liveFilters: MatchFilters = { ...filters, status: "IN_PROGRESS", modality_id: "", date_from: "", date_to: "", page: 1, size: MAX_PAGE_SIZE }
  const isLive = tab.value === "IN_PROGRESS"

  const live = useMatches(liveFilters)
  const list = useMatches(isLive ? liveFilters : filters)
  const modalities = useModalities(seasonId)
  useMatchesLive(seasonId)

  function update(patch: Partial<MatchFilters>) {
    const query = toQuery({ ...withFilters(filters, patch), season_id: "" }, true).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const liveItems = live.data?.items ?? []

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Status das partidas" className="flex gap-6 border-b border-border">
        {TABS.map((t) => {
          const selected = t.value === tab.value
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => update({ status: t.value })}
              className={cn(
                "type-label -mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 pb-3",
                selected ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground hover:text-ink",
              )}
            >
              {t.label}
              {t.value === "IN_PROGRESS" && live.isSuccess && live.data.total > 0 && <Badge variant="danger">{live.data.total}</Badge>}
              {selected && !isLive && list.isSuccess && <Badge variant="success">{list.data.total}</Badge>}
            </button>
          )
        })}
      </div>

      <section role="tabpanel" aria-label={tab.label} className="space-y-4">
        {!isLive && <MonitorMatchFilters filters={filters} modalities={modalities.data ?? []} onChange={update} />}
        {list.isPending && <MatchListLoading />}
        {list.isError && <ErrorState title="Não foi possível carregar as partidas." onRetry={() => list.refetch()} />}
        {list.isSuccess && (
          <>
            {list.data.items.length ? (
              <>
                {tab.value === "IN_PROGRESS" && <LiveMatchTable matches={list.data.items} modalities={modalities.data ?? []} />}
                {tab.value === "SCHEDULED" && <ScheduledMatchTable matches={list.data.items} onStart={setStarting} />}
                {tab.value === "FINISHED" && <FinishedMatchTable matches={list.data.items} />}
              </>
            ) : (
              <EmptyState
                title={tab.empty}
                description={isLive ? "Inicie uma partida na aba Agendadas." : "Ajuste ou limpe os filtros para ver mais jogos."}
              />
            )}
            {!isLive && list.data.total > 0 && (
              <MatchPagination page={list.data.page} size={list.data.size} total={list.data.total} onPage={(page) => update({ page })} />
            )}
          </>
        )}
      </section>

      {starting && <StartMatchDialog match={starting} liveMatches={liveItems} onClose={() => setStarting(null)} />}
    </div>
  )
}
