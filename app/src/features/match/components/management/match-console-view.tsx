"use client"

import { useState } from "react"
import { EmptyState, ErrorState } from "@/shared/components/request-states"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { Chip } from "@/shared/components/ui/chip"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { SCORE_TYPE_LABELS } from "../../constants"
import { useMatch } from "../../hooks/use-match"
import { useMatchLive } from "../../hooks/use-match-live"
import type { MatchDetail, MatchPlayer, MatchTeam } from "../../types/match"
import { isVolleyMatch, roundLabel, stageLabel } from "../../utils/match-card"
import { playerCards } from "../../utils/match-timeline"
import { MatchTimeline } from "../match-timeline"
import { StartMatchDialog } from "../start-match-dialog"
import { ConnectionBadge } from "./connection-badge"
import { ConsoleRoster } from "./console-roster"
import { ConsoleScoreboard } from "./console-scoreboard"
import { CorrectEventDialog } from "./correct-event-dialog"
import { EndPeriodDialog } from "./end-period-dialog"
import { EndShootout } from "./end-shootout"
import { EventDialog } from "./event-dialog"
import { FinishMatch } from "./finish-match"
import { PenaltyKicks } from "./penalty-kicks"
import { PenaltyShootout } from "./penalty-shootout"
import { SetHistory } from "./set-history"

function configLabel({ modality_configuration: c }: MatchDetail) {
  if (!c) return null
  const periods = c.num_periods && c.period_duration_minutes ? `${c.num_periods} × ${c.period_duration_minutes} min` : null
  const score = c.score_type ? (SCORE_TYPE_LABELS[c.score_type] ?? c.score_type) : null
  const sets = c.sets_to_win ? `${c.sets_to_win} sets para vencer` : null
  return [periods, score && `Pontuação por ${score.toLowerCase()}`, sets].filter(Boolean).join(" · ")
}

type Panel = "team1" | "events" | "team2"

export function MatchConsoleView({ id }: { id: string }) {
  const result = useMatch(id)
  const [starting, setStarting] = useState(false)
  const [endingPeriod, setEndingPeriod] = useState(false)
  const [correcting, setCorrecting] = useState<{ eventId: string | null } | null>(null)
  const [selected, setSelected] = useState<{ team: MatchTeam; player: MatchPlayer } | null>(null)
  // Abaixo de `lg` só um painel aparece por vez.
  const [panel, setPanel] = useState<Panel>("events")
  const live = result.data?.status === "IN_PROGRESS"
  const shootout = live && Boolean(result.data?.penalty_shootout_active)
  const connection = useMatchLive(id, live)

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

  const cards = playerCards(match.timeline)
  const head = [match.modality_name, stageLabel(match), roundLabel(match)].filter(Boolean).join(" · ")
  const config = configLabel(match)
  const selectFrom = (team: MatchTeam | null) =>
    live && !shootout && team ? (player: MatchPlayer) => setSelected({ team, player }) : undefined
  const panelClass = (key: Panel) => cn("min-w-0 space-y-4", panel !== key && "max-lg:hidden")
  const panels: { key: Panel; label: string }[] = [
    { key: "team1", label: match.team1?.name ?? "A definir" },
    { key: "events", label: "Eventos" },
    { key: "team2", label: match.team2?.name ?? "A definir" },
  ]

  return (
    <div className="space-y-4">
      <Card className="pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4">
          <div>
            <p className="type-overline text-primary-text">{head}</p>
            {config && <p className="type-small text-muted-foreground">{config}</p>}
          </div>
          <ConnectionBadge status={connection} />
        </div>
        {shootout ? (
          <div className="space-y-4 p-4">
            <PenaltyShootout match={match} />
            <div className="flex justify-center">
              <EndShootout match={match} />
            </div>
          </div>
        ) : (
          <ConsoleScoreboard
            match={match}
            onPlay={() => setStarting(true)}
            onEndPeriod={() => setEndingPeriod(true)}
            onUndo={() => setCorrecting({ eventId: null })}
          >
            <FinishMatch match={match} />
          </ConsoleScoreboard>
        )}
      </Card>

      <div role="group" aria-label="Painel" className="flex gap-1.5 overflow-x-auto p-1 lg:hidden">
        {panels.map(({ key, label }) => (
          <Chip key={key} selected={panel === key} onClick={() => setPanel(key)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className={panelClass("team1")}>
          <ConsoleRoster team={match.team1} players={match.team1_players} cards={cards} onSelect={selectFrom(match.team1)} />
        </div>
        <div className={panelClass("events")}>
          {isVolleyMatch(match) && <SetHistory match={match} />}
          {shootout ? (
            <PenaltyKicks match={match} />
          ) : (
            <Card>
              <CardHeader title="Eventos" />
              <MatchTimeline
                match={match}
                onSelect={live || match.status === "FINISHED" ? (eventId) => setCorrecting({ eventId }) : undefined}
              />
            </Card>
          )}
        </div>
        <div className={panelClass("team2")}>
          <ConsoleRoster team={match.team2} players={match.team2_players} cards={cards} onSelect={selectFrom(match.team2)} />
        </div>
      </div>

      {selected && live && !shootout && (
        <EventDialog
          key={selected.player.user_id}
          match={match}
          team={selected.team}
          player={selected.player}
          yellows={cards.get(selected.player.user_id)?.yellow ?? 0}
          onClose={() => setSelected(null)}
        />
      )}

      {correcting && !shootout && <CorrectEventDialog match={match} eventId={correcting.eventId} onClose={() => setCorrecting(null)} />}

      {endingPeriod && live && !shootout && <EndPeriodDialog match={match} onClose={() => setEndingPeriod(false)} />}

      {starting && match.status === "SCHEDULED" && <StartMatchDialog match={match} liveMatches={[]} onClose={() => setStarting(false)} />}
    </div>
  )
}
