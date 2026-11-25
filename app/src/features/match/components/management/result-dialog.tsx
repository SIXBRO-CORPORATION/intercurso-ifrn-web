"use client"

import { Check } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import type { MatchTeam } from "../../types/match"

type ResultProps = {
  team1: MatchTeam
  team2: MatchTeam
  score1: number
  score2: number
  winner: MatchTeam | null
  label: string
  penalties?: [number, number]
}

export function ResultBox({ team1, team2, score1, score2, winner, label, penalties }: ResultProps) {
  const side = (score: number, index: 0 | 1) => (penalties ? `${score}(${penalties[index]})` : score)
  return (
    <div className="space-y-2 rounded-md bg-sunken p-4 text-center">
      <div className="grid grid-cols-2 gap-2">
        <p className="type-h3 wrap-break-word">{team1.name}</p>
        <p className="type-h3 wrap-break-word">{team2.name}</p>
      </div>
      <p className="text-4xl font-bold tabular-nums">
        <span className="sr-only">Placar </span>
        {side(score1, 0)} × {side(score2, 1)}
      </p>
      <Badge variant={winner ? "success" : "neutral"}>{winner ? `${label}: ${winner.name}` : "Empate"}</Badge>
    </div>
  )
}

type DialogProps = {
  title: string
  description: string
  result: ResultProps
  error: string | null
  pending: boolean
  cancelLabel: string
  confirmLabel: string
  pendingLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function ResultDialog({
  title,
  description,
  result,
  error,
  pending,
  cancelLabel,
  confirmLabel,
  pendingLabel,
  onCancel,
  onConfirm,
}: DialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next && !pending) onCancel()
      }}
    >
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <ResultBox {...result} />
        {error && (
          <div role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-danger-text">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" disabled={pending} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button disabled={pending} onClick={onConfirm}>
            <Check aria-hidden /> {pending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
