"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useModalities } from "@/features/modality"
import { ErrorState, EmptyState, ListSkeleton } from "@/shared/components/request-states"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { MAX_PAGE_SIZE } from "../constants"
import { useMatches } from "../hooks/use-matches"
import { useMatchesLive } from "../hooks/use-matches-live"
import type { Match, MatchFilters, MatchStatus } from "../types/match"
import { clockLimit } from "../utils/match-card"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { MatchPagination } from "./match-pagination"
import { MonitorMatchFilters } from "./monitor-match-filters"
import { MonitorMatchRow } from "./monitor-match-row"
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
    <Tabs value={tab.value} onValueChange={(value) => update({ status: value as MatchStatus })} className="space-y-4">
      <TabsList variant="pill" aria-label="Status das partidas">
        {TABS.map((t) => {
          const count =
            t.value === "IN_PROGRESS" ? live.data?.total : t.value === tab.value ? list.data?.total : undefined
          return (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              {!!count && <span className="text-[0.6875rem] opacity-75">{count}</span>}
            </TabsTrigger>
          )
        })}
      </TabsList>

      <TabsContent value={tab.value} className="space-y-4">
        {!isLive && <MonitorMatchFilters filters={filters} modalities={modalities.data ?? []} onChange={update} />}
        {list.isPending && <ListSkeleton label="Carregando partidas…" />}
        {list.isError && <ErrorState title="Não foi possível carregar as partidas." onRetry={() => list.refetch()} />}
        {list.isSuccess && (
          <>
            {list.data.items.length ? (
              <Card>
                <CardHeader title={tab.label} />
                <ul className="divide-y divide-border">
                  {list.data.items.map((match) => (
                    <MonitorMatchRow
                      key={match.match_id}
                      match={match}
                      limit={clockLimit(modalities.data?.find((m) => m.modality_id === match.modality_id), match.current_period)}
                      onStart={setStarting}
                    />
                  ))}
                </ul>
              </Card>
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
      </TabsContent>

      {starting && <StartMatchDialog match={starting} liveMatches={liveItems} onClose={() => setStarting(null)} />}
    </Tabs>
  )
}
