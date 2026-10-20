"use client"

import { useActiveSeason } from "@/features/season"
import { MatchList } from "./match-list"
import { MatchListLoading, MatchListMessage } from "./match-list-states"

export function MatchListView() {
  const season = useActiveSeason()
  if (season.status === "loading") return <MatchListLoading />
  if (season.status === "error") return <MatchListMessage alert title="Não foi possível carregar a temporada." />
  if (!season.season) return <MatchListMessage title="Nenhuma temporada ativa.">Volte quando o Intercurso começar.</MatchListMessage>
  return <MatchList seasonId={season.season.season_id} />
}
