"use client"

import { useActiveSeason } from "@/features/season"
import { EmptyState, ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { MatchList } from "./match-list"

export function MatchListView() {
  const season = useActiveSeason()
  if (season.isPending) return <ListSkeleton label="Carregando partidas…" />
  if (season.isError) return <ErrorState title="Não foi possível carregar a temporada." onRetry={() => season.refetch()} />
  if (!season.data) return <EmptyState title="Nenhuma temporada ativa." description="Volte quando o Intercurso começar." />
  return <MatchList season={season.data} />
}
