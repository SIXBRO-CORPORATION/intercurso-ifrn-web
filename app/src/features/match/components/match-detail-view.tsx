"use client"

import { ErrorState, EmptyState } from "@/shared/components/request-states"
import { Card } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useMatch } from "../hooks/use-match"
import { phaseLabel } from "../utils/match-card"
import { MatchHeader } from "./match-header"
import { MatchRoster } from "./match-roster"
import { MatchTimeline } from "./match-timeline"

export function MatchDetailView({ id }: { id: string }) {
  const result = useMatch(id)

  if (result.isPending) {
    return (
      <div role="status" aria-busy="true">
        <span className="sr-only">Carregando partida…</span>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }
  if (result.isError) return <ErrorState title="Não foi possível carregar a partida." onRetry={() => result.refetch()} />
  const match = result.data
  if (!match) return <EmptyState title="Partida não encontrada." />

  return (
    <Card>
      <p className="type-overline bg-muted px-4 py-2.5 text-center text-text-secondary">
        {[match.modality_name, phaseLabel(match)].filter(Boolean).join(" · ")}
      </p>
      <MatchHeader match={match} />
      <Tabs defaultValue="events">
        <TabsList aria-label="Detalhes da partida">
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="lineups">Escalações</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <MatchTimeline match={match} />
        </TabsContent>
        <TabsContent value="lineups">
          <MatchRoster match={match} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
