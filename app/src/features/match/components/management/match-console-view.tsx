"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { EmptyState, ErrorState } from "@/shared/components/request-states"
import { LiveDot } from "@/shared/components/live-dot"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SCORE_TYPE_LABELS, STATUS_OPTIONS } from "../../constants"
import { useMatch } from "../../hooks/use-match"
import { useMatchLive } from "../../hooks/use-match-live"
import type { MatchDetail, MatchPlayer, MatchTeam } from "../../types/match"
import { roundLabel, stageLabel, teamsLabel } from "../../utils/match-card"
import { playerCards } from "../../utils/match-timeline"
import { MatchTimeline } from "../match-timeline"
import { StartMatchDialog } from "../start-match-dialog"
import { ConnectionBadge } from "./connection-badge"
import { ConsoleRoster } from "./console-roster"
import { ConsoleScoreboard } from "./console-scoreboard"
import { EndPeriodDialog } from "./end-period-dialog"
import { EventDialog } from "./event-dialog"

function configLabel({ modality_configuration: c }: MatchDetail) {
  if (!c) return null
  const periods = c.num_periods && c.period_duration_minutes ? `${c.num_periods} × ${c.period_duration_minutes} min` : null
  const score = c.score_type ? (SCORE_TYPE_LABELS[c.score_type] ?? c.score_type) : null
  const sets = c.sets_to_win ? `${c.sets_to_win} sets para vencer` : null
  return [periods, score && `Pontuação por ${score.toLowerCase()}`, sets].filter(Boolean).join(" · ")
}

export function MatchConsoleView({ id }: { id: string }) {
  const result = useMatch(id)
  const [starting, setStarting] = useState(false)
  const [endingPeriod, setEndingPeriod] = useState(false)
  const [selected, setSelected] = useState<{ team: MatchTeam; player: MatchPlayer } | null>(null)
  const live = result.data?.status === "IN_PROGRESS"
  const connection = useMatchLive(id, live)

  if (result.isPending) {
    return (
      <div role="status" aria-busy="true" className="h-96 rounded-xl bg-border/60 motion-safe:animate-pulse">
        <span className="sr-only">Carregando partida…</span>
      </div>
    )
  }
  if (result.isError) return <ErrorState title="Não foi possível carregar a partida." onRetry={() => result.refetch()} />
  const match = result.data
  if (!match) return <EmptyState title="Partida não encontrada." />

  const cards = playerCards(match.timeline)
  const config = configLabel(match)
  const badges = [stageLabel(match), roundLabel(match)].filter(Boolean)
  const selectFrom = (team: MatchTeam | null) =>
    live && team ? (player: MatchPlayer) => setSelected({ team, player }) : undefined
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === match.status)?.label

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="type-large-title text-ink">{teamsLabel(match)}</h1>
            <Badge variant="success">{match.modality_name}</Badge>
            {badges.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
            <Badge variant={live ? "danger" : "neutral"}>
              {live && match.clock_running && <LiveDot />}
              {live && match.clock_running ? "Ao vivo" : statusLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionBadge status={connection} />
            <Button variant="dark" disabled>
              <Flag aria-hidden /> Finalizar partida
            </Button>
          </div>
        </div>
        {config && <p className="type-caption text-muted-foreground">{config}</p>}
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_1.4fr_1fr]">
        <div className="lg:order-1">
          <ConsoleRoster team={match.team1} players={match.team1_players} cards={cards} onSelect={selectFrom(match.team1)} />
        </div>
        <div className="space-y-4 lg:order-2">
          <ConsoleScoreboard match={match} onPlay={() => setStarting(true)} onEndPeriod={() => setEndingPeriod(true)} />
          <Card className="p-5">
            <MatchTimeline match={match} title="Linha do tempo" />
          </Card>
        </div>
        <div className="lg:order-3">
          <ConsoleRoster team={match.team2} players={match.team2_players} cards={cards} onSelect={selectFrom(match.team2)} />
        </div>
      </div>

      {selected && live && (
        <EventDialog
          key={selected.player.user_id}
          match={match}
          team={selected.team}
          player={selected.player}
          yellows={cards.get(selected.player.user_id)?.yellow ?? 0}
          onClose={() => setSelected(null)}
        />
      )}

      {endingPeriod && live && <EndPeriodDialog match={match} onClose={() => setEndingPeriod(false)} />}

      {starting && match.status === "SCHEDULED" && <StartMatchDialog match={match} liveMatches={[]} onClose={() => setStarting(false)} />}
    </div>
  )
}
