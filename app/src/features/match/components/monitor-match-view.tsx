"use client"

import { useActiveSeason } from "@/features/season"
import { EmptyState, ErrorState } from "@/shared/components/request-states"
import { MatchListLoading } from "./match-list-states"
import { MonitorMatchList } from "./monitor-match-list"

export function MonitorMatchView() {
  const season = useActiveSeason()
  if (season.isPending) return <MatchListLoading />
  if (season.isError) return <ErrorState title="Não foi possível carregar a temporada." onRetry={() => season.refetch()} />
  if (!season.data) return <EmptyState title="Nenhuma temporada ativa." description="As partidas aparecem quando uma temporada estiver em andamento." />
  return <MonitorMatchList seasonId={season.data.season_id} />
}
