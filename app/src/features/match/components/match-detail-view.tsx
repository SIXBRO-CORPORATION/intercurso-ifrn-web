"use client"

import { Button } from "@/shared/components/ui/button"
import { useMatch } from "../hooks/use-match"
import { MatchHeader } from "./match-header"
import { MatchListMessage } from "./match-list-states"
import { MatchRoster } from "./match-roster"
import { MatchTimeline } from "./match-timeline"

export function MatchDetailView({ id }: { id: string }) {
  const result = useMatch(id)

  if (result.isPending) {
    return (
      <div role="status" aria-busy="true" className="h-56 rounded-xl bg-border/60 motion-safe:animate-pulse">
        <span className="sr-only">Carregando partida…</span>
      </div>
    )
  }
  if (result.isError) {
    return (
      <MatchListMessage alert title="Não foi possível carregar a partida.">
        <Button variant="danger" onClick={() => result.refetch()}>Tentar novamente</Button>
      </MatchListMessage>
    )
  }
  if (!result.data) return <MatchListMessage title="Partida não encontrada." />
  return (
    <div className="space-y-8">
      <MatchHeader match={result.data} />
      <MatchTimeline match={result.data} />
      <MatchRoster match={result.data} />
    </div>
  )
}
