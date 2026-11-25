import Link from "next/link"
import { FileText, Gamepad2, Play } from "lucide-react"
import { href } from "@/core/routes/route-registry"
import { Button } from "@/shared/components/ui/button"
import type { Match } from "../types/match"
import { roundLabel, stageLabel } from "../utils/match-card"
import { MatchRow } from "./match-row"

type Props = { match: Match; limit: number | null; onStart: (match: Match) => void }

function Action({ match, onStart }: Omit<Props, "limit">) {
  if (match.status === "SCHEDULED") {
    return (
      <Button size="sm" onClick={() => onStart(match)}>
        <Play aria-hidden /> Iniciar partida
      </Button>
    )
  }
  const live = match.status === "IN_PROGRESS"
  const Icon = live ? Gamepad2 : FileText
  return (
    <Button asChild size="sm" variant={live ? "secondary" : "ghost"}>
      <Link href={href(live ? "manageMatch" : "match", { id: match.match_id })}>
        <Icon aria-hidden /> {live ? "Gerenciar" : "Ver partida"}
      </Link>
    </Button>
  )
}

export function MonitorMatchRow({ match, limit, onStart }: Props) {
  const meta = [match.modality_name, stageLabel(match), roundLabel(match)].filter(Boolean).join(" · ")
  return (
    <li className="flex flex-wrap items-center justify-end gap-x-2 pr-3 max-sm:pb-2">
      <div className="min-w-0 flex-1 max-sm:basis-full">
        <MatchRow match={match} meta={meta} limit={limit} />
      </div>
      <Action match={match} onStart={onStart} />
    </li>
  )
}
