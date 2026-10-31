"use client"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail } from "../../types/match"
import { periodLabel } from "../../utils/match-card"
import { parseMatchActionError } from "../../utils/match-action-error"

type Props = { match: MatchDetail; onClose: () => void }

export function EndPeriodDialog({ match, onClose }: Props) {
  const end = useMatchAction(match.match_id)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !end.isPending) onClose()
      }}
    >
      <DialogContent>
        <DialogTitle>Finalizar {periodLabel(match.current_period) ?? "período"}?</DialogTitle>
        <DialogDescription>O cronômetro será pausado. Depois você poderá iniciar o próximo período.</DialogDescription>
        {end.isError && (
          <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
            {parseMatchActionError(end.error)}
          </div>
        )}
        <DialogFooter>
          <Button variant="neutral" disabled={end.isPending} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={end.isPending} onClick={() => end.mutate("period/end", { onSuccess: onClose })}>
            {end.isPending ? "Finalizando…" : "Finalizar período"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
