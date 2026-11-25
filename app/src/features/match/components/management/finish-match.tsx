"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useMatchAction } from "../../hooks/use-match-action"
import type { MatchDetail } from "../../types/match"
import { parseMatchActionError } from "../../utils/match-action-error"
import { finishResult } from "../../utils/match-finish"
import { isGroupTie, isKnockoutTie } from "../../utils/match-penalties"
import { ResultDialog } from "./result-dialog"

export function FinishMatch({ match }: { match: MatchDetail }) {
  const action = useMatchAction(match.match_id)
  const [open, setOpen] = useState(false)
  const result = finishResult(match)
  const knockoutTie = isKnockoutTie(match)
  const blocked = !result || (result.sets && !result.winner)
  const error = action.isError ? parseMatchActionError(action.error) : null

  const close = () => {
    action.reset()
    setOpen(false)
  }

  const start = () => {
    action.reset()
    if (isGroupTie(match)) return action.mutate("finish", { onError: () => setOpen(true) })
    setOpen(true)
  }

  const confirm = () =>
    knockoutTie ? action.mutate("penalty-shootout/start", { onSuccess: close }) : action.mutate("finish")

  return (
    <>
      <Button variant="dark" disabled={blocked || action.isPending} onClick={start}>
        <Flag aria-hidden /> Finalizar partida
      </Button>
      {open && result && (
        <ResultDialog
          title={knockoutTie ? "Partida empatada" : "Finalizar partida?"}
          description={
            knockoutTie
              ? "A partida terminou empatada. Iniciar disputa de pênaltis?"
              : "Confira o resultado antes de confirmar."
          }
          result={{ ...result, label: "Vencedor" }}
          error={error}
          pending={action.isPending}
          cancelLabel={knockoutTie ? "Cancelar" : "Voltar ao jogo"}
          confirmLabel={knockoutTie ? "Iniciar pênaltis" : "Finalizar partida"}
          pendingLabel={knockoutTie ? "Iniciando…" : "Finalizando…"}
          onCancel={close}
          onConfirm={confirm}
        />
      )}
    </>
  )
}
