"use client"

import { useActiveSeason } from "@/features/season"
import { MatchList } from "./match-list"
import { MatchListLoading, MatchListMessage } from "./match-list-states"

export function MatchListView() {
  const season = useActiveSeason()
  if (season.isPending) return <MatchListLoading />
  if (season.isError) return <MatchListMessage alert title="Não foi possível carregar a temporada." />
  if (!season.data) return <MatchListMessage title="Nenhuma temporada ativa.">Volte quando o Intercurso começar.</MatchListMessage>
  return <MatchList seasonId={season.data.season_id} />
}
