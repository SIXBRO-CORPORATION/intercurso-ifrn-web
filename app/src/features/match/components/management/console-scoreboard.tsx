import type { ReactNode } from "react"
import { Pause, Play, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveDot } from "@/shared/components/live-dot"
import { Button } from "@/shared/components/ui/button"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail, MatchTeam } from "../../types/match"
import { isVolleyMatch, matchClockLimit, periodLabel } from "../../utils/match-card"
import { parseMatchActionError } from "../../utils/match-action-error"
import { matchWinnerTeam } from "../../utils/match-finish"
import { hasShootout, withPenalties } from "../../utils/match-penalties"
import { hasNextPeriod, isPeriodEnded, lastCorrectableEvent } from "../../utils/match-timeline"
import { LiveClock } from "../live-clock"
import { Scoreboard } from "../scoreboard"
import { SetPrompt } from "./set-prompt"

type Props = {
  match: MatchDetail
  onPlay: () => void
  onEndPeriod: () => void
  onUndo?: () => void
  /** Ações extras exibidas junto aos controles enquanto a partida está em andamento. */
  children?: ReactNode
}

export function ConsoleScoreboard({ match, onPlay, onEndPeriod, onUndo, children }: Props) {
  const action = useMatchAction(match.match_id)
  const { team1, team2, status } = match
  const volley = isVolleyMatch(match)
  const live = status === "IN_PROGRESS"
  const shootout = status === "FINISHED" && hasShootout(match)
  const winner = matchWinnerTeam(match)
  const value = (t: MatchTeam | null) => withPenalties((volley && status === "FINISHED" ? t?.sets_won : t?.score) ?? 0, t, shootout)
  const ended = live && !volley && isPeriodEnded(match.timeline)
  const noNextPeriod = !hasNextPeriod(match)
  const locked = ended || action.isPending
  const period = !volley && live ? periodLabel(match.current_period) : null
  const state = ended
    ? "Período encerrado"
    : live
      ? match.clock_running
        ? "Rodando"
        : "Pausado"
      : status === "FINISHED"
        ? "Encerrada"
        : "Aguardando início"

  return (
    <section aria-label="Placar" className="flex flex-col items-center gap-3 pb-4">
      <Scoreboard team1={team1} team2={team2}>
        <p className={cn("type-score", live && "text-live", status === "SCHEDULED" && "text-muted-foreground")}>
          <span className="sr-only">Placar </span>
          {value(team1)} – {value(team2)}
        </p>
        <p className={cn("type-small flex items-center gap-1.5", live ? "font-bold text-live" : "text-text-secondary")}>
          {live && (match.clock_running ? <LiveDot /> : <Pause className="size-3.5" aria-hidden />)}
          <span>{state}</span>
          {period && <span>{period}</span>}
        </p>
        {live && (
          <p className="type-h2 tabular-nums">
            {volley ? (
              `Set ${match.sets.length + 1} · Sets ${team1?.sets_won ?? 0} – ${team2?.sets_won ?? 0}`
            ) : (
              <LiveClock seconds={match.clock_seconds} running={match.clock_running} limit={matchClockLimit(match)} />
            )}
          </p>
        )}
        {status === "FINISHED" && <p className="type-small text-text-secondary">{winner ? `Vencedor: ${winner.name}` : "Empate"}</p>}
      </Scoreboard>
      {live && volley && <SetPrompt match={match} />}
      {status === "SCHEDULED" && (
        <Button size="lg" onClick={onPlay}>
          <Play aria-hidden /> Iniciar partida
        </Button>
      )}
      {live && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4">
          {ended && (
            <Button disabled={action.isPending || noNextPeriod} onClick={() => action.mutate("period/start")}>
              <Play aria-hidden /> {noNextPeriod ? "Todos os períodos disputados" : "Iniciar próximo período"}
            </Button>
          )}
          <Button
            size="icon"
            variant={match.clock_running ? "secondary" : "default"}
            aria-label={match.clock_running ? "Pausar" : "Retomar"}
            title={match.clock_running ? "Pausar cronômetro" : "Retomar cronômetro"}
            disabled={locked}
            onClick={() => action.mutate(match.clock_running ? "clock/pause" : "clock/resume")}
          >
            {match.clock_running ? <Pause aria-hidden /> : <Play aria-hidden />}
          </Button>
          {!volley && (
            <Button variant="secondary" disabled={locked} onClick={onEndPeriod}>
              Fim do período
            </Button>
          )}
          <Button
            variant="ghost"
            disabled={!onUndo || action.isPending || !lastCorrectableEvent(match.timeline)}
            onClick={onUndo}
          >
            <Undo2 aria-hidden /> Desfazer
          </Button>
          {children}
        </div>
      )}
      {action.isError && (
        <p role="alert" className="type-small mx-4 rounded-md bg-danger-soft px-3 py-2 text-center text-danger-text">
          {parseMatchActionError(action.error)}
        </p>
      )}
    </section>
  )
}
