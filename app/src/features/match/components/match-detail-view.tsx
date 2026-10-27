"use client"

import { Button } from "@/shared/components/ui/button"
import { useMatch } from "../hooks/use-match"
import { MatchHeader } from "./match-header"
import { MatchListMessage } from "./match-list-states"
import { MatchRoster } from "./match-roster"
import { MatchTimeline } from "./match-timeline"

export function MatchDetailView({ id }: { id: string }) {
  const result = useMatch(id)

  if (result.status === "loading") {
    return (
      <div role="status" aria-busy="true" className="h-56 rounded-xl bg-border/60 motion-safe:animate-pulse">
        <span className="sr-only">Carregando partida…</span>
      </div>
    )
  }
  if (result.status === "not-found") return <MatchListMessage title="Partida não encontrada." />
  if (result.status === "error") {
    return (
      <MatchListMessage alert title="Não foi possível carregar a partida.">
        <Button variant="danger" onClick={result.refetch}>Tentar novamente</Button>
      </MatchListMessage>
    )
  }
  return (
    <div className="space-y-8">
      {result.connection === "reconnecting" && (
        <p role="status" className="type-caption text-center text-muted-foreground">
          Conexão perdida. Reconectando…
        </p>
      )}
      <MatchHeader match={result.match} />
      <MatchTimeline match={result.match} />
      <MatchRoster match={result.match} />
    </div>
  )
}
