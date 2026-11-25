import type { ReactNode } from "react"
import { Avatar } from "@/shared/components/ui/avatar"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"
import type { MatchTeam } from "../types/match"

function Team({ team }: { team: MatchTeam | null }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Avatar size="lg" name={team?.name} src={resolvePhotoSrc(team?.photo)} />
      <p className="type-h3 w-full wrap-break-word">{team?.name ?? "A definir"}</p>
    </div>
  )
}

/** Duas equipes e, no meio, o que a tela quiser mostrar (placar, relógio, status). */
export function Scoreboard({ team1, team2, children }: { team1: MatchTeam | null; team2: MatchTeam | null; children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-5">
      <Team team={team1} />
      <div className="flex flex-col items-center gap-1.5 text-center">{children}</div>
      <Team team={team2} />
    </div>
  )
}
