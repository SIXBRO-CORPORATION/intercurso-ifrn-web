"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState, ErrorState } from "@/shared/components/request-states"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SCORE_TYPE_LABELS } from "../../constants"
import { useMatch } from "../../hooks/use-match"
import { useMatchLive } from "../../hooks/use-match-live"
import type { MatchDetail } from "../../types/match"
import { roundLabel, stageLabel, teamsLabel } from "../../utils/match-card"
import { MatchHeader } from "../match-header"
import { MatchTimeline } from "../match-timeline"
import { StartMatchDialog } from "../start-match-dialog"
import { ConnectionBadge } from "./connection-badge"

function configLabel({ modality_configuration: c }: MatchDetail) {
  if (!c) return null
  const periods = c.num_periods && c.period_duration_minutes ? `${c.num_periods} × ${c.period_duration_minutes} min` : null
  const score = c.score_type ? (SCORE_TYPE_LABELS[c.score_type] ?? c.score_type) : null
  const sets = c.sets_to_win ? `${c.sets_to_win} sets para vencer` : null
  return [periods, score && `Pontuação por ${score.toLowerCase()}`, sets].filter(Boolean).join(" · ")
}

function Players({ name, players }: { name: string; players: MatchDetail["team1_players"] }) {
  return (
    <Card className="space-y-3 p-4">
      <h2 className="type-section text-ink">{name}</h2>
      {players.length ? (
        <ul className="space-y-1.5">
          {players.map((p) => (
            <li key={p.user_id}>
              <button type="button" disabled className="type-body-sm w-full rounded-md bg-field px-3 py-2 text-left text-ink disabled:opacity-70">
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-body-sm text-muted-foreground">Elenco não disponível.</p>
      )}
    </Card>
  )
}

export function MatchConsoleView({ id }: { id: string }) {
  const result = useMatch(id)
  const [starting, setStarting] = useState(false)
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

  const scheduled = match.status === "SCHEDULED"
  const config = configLabel(match)
  const badges = [match.modality_name, stageLabel(match), roundLabel(match)].filter(Boolean)

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="type-large-title text-ink">{teamsLabel(match)}</h1>
          <ConnectionBadge status={connection} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((label, i) => (
            <Badge key={label} variant={i === 0 ? "success" : "neutral"}>{label}</Badge>
          ))}
          {config && <span className="type-caption text-muted-foreground">{config}</span>}
        </div>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_1.3fr_1fr]">
        <div className="lg:order-1">
          <Players name={match.team1?.name ?? "A definir"} players={match.team1_players} />
        </div>
        <div className="space-y-4 lg:order-2">
          <MatchHeader match={match} />
          <div className={cn("grid gap-2", scheduled ? "grid-cols-1" : "grid-cols-3")}>
            {scheduled && (
              <Button size="lg" onClick={() => setStarting(true)}>
                <Play aria-hidden /> Play
              </Button>
            )}
            <Button variant="neutral" disabled>
              <Pause aria-hidden /> {match.clock_running ? "Pausar" : "Retomar"}
            </Button>
            <Button variant="neutral" disabled>Fim do período</Button>
            <Button variant="neutral" disabled>Desfazer</Button>
          </div>
          <MatchTimeline match={match} />
        </div>
        <div className="lg:order-3">
          <Players name={match.team2?.name ?? "A definir"} players={match.team2_players} />
        </div>
      </div>

      {starting && scheduled && <StartMatchDialog match={match} liveMatches={[]} onClose={() => setStarting(false)} />}
    </div>
  )
}
