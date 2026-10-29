"use client"

import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { MANAGE_PATH } from "../constants"
import { useStartMatch } from "../hooks/use-start-match"
import type { Match } from "../types/match"
import { teamsLabel } from "../utils/match-card"
import { parseStartError } from "../utils/start-match-error"

type Props = { match: Match; liveMatches: Match[]; onClose: () => void }

export function StartMatchDialog({ match, liveMatches, onClose }: Props) {
  const start = useStartMatch()
  const failure = start.isError ? parseStartError(start.error) : null
  const ongoing = failure?.ongoingMatchId ? liveMatches.find((m) => m.match_id === failure.ongoingMatchId) : undefined

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !start.isPending) onClose()
      }}
    >
      <DialogContent>
        <DialogTitle>Começar partida?</DialogTitle>
        <DialogDescription>
          {teamsLabel(match)} · {match.modality_name}. A partida passa para em andamento e o cronômetro começa agora.
        </DialogDescription>
        {failure && (
          <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
            <p>{failure.message}</p>
            {failure.ongoingMatchId && (
              <Link
                href={`${MANAGE_PATH}/${failure.ongoingMatchId}`}
                className="mt-1 inline-block font-bold underline underline-offset-4"
              >
                {ongoing ? `Ir para ${teamsLabel(ongoing)}` : "Ir para a partida em andamento"}
              </Link>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="neutral" disabled={start.isPending} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={start.isPending} onClick={() => start.mutate(match.match_id, { onSuccess: onClose })}>
            {start.isPending ? "Iniciando…" : "Iniciar partida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
