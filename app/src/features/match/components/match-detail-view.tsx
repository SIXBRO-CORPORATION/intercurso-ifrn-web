"use client"

import { Tabs } from "radix-ui"
import { Button } from "@/shared/components/ui/button"
import { segmentedItem, segmentedList } from "@/shared/components/ui/segmented-class"
import { useMatch } from "../hooks/use-match"
import { MatchHeader } from "./match-header"
import { MatchListMessage } from "./match-list-states"
import { MatchRoster } from "./match-roster"
import { MatchTimeline } from "./match-timeline"

export function MatchDetailView({ id }: { id: string }) {
  const result = useMatch(id)

  if (result.status === "loading") {
    return (
      <div role="status" aria-busy="true" className="space-y-4">
        <div className="h-56 rounded-xl bg-border/60 motion-safe:animate-pulse" />
        <div className="h-11 rounded-full bg-border/60 motion-safe:animate-pulse" />
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
  const { match } = result
  return (
    <div className="space-y-5">
      <MatchHeader match={match} />
      <Tabs.Root defaultValue={match.status === "SCHEDULED" ? "roster" : "timeline"} className="space-y-4">
        <Tabs.List aria-label="Seções da partida" className={segmentedList}>
          <Tabs.Trigger value="timeline" className={segmentedItem}>Lances</Tabs.Trigger>
          <Tabs.Trigger value="roster" className={segmentedItem}>Elencos</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="timeline" className="outline-none">
          <MatchTimeline match={match} />
        </Tabs.Content>
        <Tabs.Content value="roster" className="outline-none">
          <MatchRoster match={match} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
