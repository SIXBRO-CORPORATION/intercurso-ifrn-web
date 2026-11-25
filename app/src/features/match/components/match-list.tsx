"use client"

import { useState, useSyncExternalStore, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { href } from "@/core/routes/route-registry"
import { useModalities } from "@/features/modality"
import { SEASON_STATUS_BADGES, type Season } from "@/features/season"
import { LiveDot } from "@/shared/components/live-dot"
import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { useMatches } from "../hooks/use-matches"
import type { MatchFilters, MatchStatus } from "../types/match"
import { clockLimit, phaseLabel } from "../utils/match-card"
import { parseFilters, toQuery, withFilters } from "../utils/match-filters"
import { MatchDetailView } from "./match-detail-view"
import { MatchFiltersBar } from "./match-filters-bar"
import { ModalityChips, ModalityMenu } from "./match-modality-filter"
import { MatchPagination } from "./match-pagination"
import { MatchRow } from "./match-row"

const GROUPS: { status: MatchStatus; title: string }[] = [
  { status: "IN_PROGRESS", title: "Ao vivo agora" },
  { status: "SCHEDULED", title: "Agendadas" },
  { status: "FINISHED", title: "Encerradas" },
]

// A partir daqui o detalhe aparece ao lado da lista (mesmo corte do `lg:` abaixo).
const SPLIT_QUERY = "(min-width: 64rem)"

function subscribeSplit(onChange: () => void) {
  const media = window.matchMedia(SPLIT_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

const useSplitView = () => useSyncExternalStore(subscribeSplit, () => window.matchMedia(SPLIT_QUERY).matches, () => false)

// A temporada é sempre a ativa; só os demais filtros vivem na URL.
export function MatchList({ season }: { season: Season }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const filters = { ...parseFilters(new URLSearchParams(params)), season_id: season.season_id }
  const result = useMatches(filters)
  const modalities = useModalities(season.season_id)
  const split = useSplitView()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function update(patch: Partial<MatchFilters>) {
    const query = toQuery({ ...withFilters(filters, patch), season_id: "" }, true).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const items = result.data?.items ?? []
  const selected =
    items.find((m) => m.match_id === selectedId) ?? items.find((m) => m.status === "IN_PROGRESS") ?? items[0]

  // Em telas largas o clique abre o detalhe ao lado; Ctrl/⌘+clique continua abrindo em outra aba.
  function select(event: MouseEvent, matchId: string) {
    if (!split || event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    setSelectedId(matchId)
  }

  const badge = SEASON_STATUS_BADGES[season.status]
  const modalityProps = {
    modalities: modalities.data ?? [],
    selected: filters.modality_id,
    onSelect: (modality_id: string) => update({ modality_id }),
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[15rem_minmax(0,1fr)_24rem]">
      <aside className="hidden space-y-3 xl:block">
        <Card className="flex flex-col items-start gap-1.5 px-4 py-3.5">
          <p className="type-overline text-primary-text">Temporada atual</p>
          <p className="type-h2">{season.name}</p>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </Card>
        <ModalityMenu {...modalityProps} />
      </aside>

      <div className="min-w-0 space-y-3">
        <div className="xl:hidden">
          <ModalityChips {...modalityProps} />
        </div>
        <MatchFiltersBar filters={filters} onChange={update} />
        {result.isPending && <ListSkeleton label="Carregando partidas…" />}
        {result.isError && <ErrorState title="Não foi possível carregar as partidas." onRetry={() => result.refetch()} />}
        {result.isSuccess && !items.length && (
          <EmptyState title="Nenhuma partida encontrada." description="Ajuste ou limpe os filtros para ver mais jogos." />
        )}
        {GROUPS.map(({ status, title }) => {
          const rows = items.filter((m) => m.status === status)
          if (!rows.length) return null
          return (
            <Card key={status}>
              <CardHeader title={title} action={status === "IN_PROGRESS" ? <LiveDot className="text-live" /> : undefined} />
              <ul className="divide-y divide-border">
                {rows.map((m) => (
                  <li key={m.match_id}>
                    <Link
                      href={href("match", { id: m.match_id })}
                      onClick={(event) => select(event, m.match_id)}
                      aria-current={split && m === selected ? "true" : undefined}
                      className="block outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset aria-[current=true]:bg-selected"
                    >
                      <MatchRow
                        match={m}
                        meta={[m.modality_name, phaseLabel(m)].filter(Boolean).join(" · ")}
                        limit={clockLimit(modalities.data?.find((x) => x.modality_id === m.modality_id), m.current_period)}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
        {result.isSuccess && result.data.total > 0 && (
          <MatchPagination page={result.data.page} size={result.data.size} total={result.data.total} onPage={(page) => update({ page })} />
        )}
      </div>

      {split && selected && (
        <div className="min-w-0">
          <MatchDetailView key={selected.match_id} id={selected.match_id} />
        </div>
      )}
    </div>
  )
}
