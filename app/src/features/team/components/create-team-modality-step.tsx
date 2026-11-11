"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getGenderModeLabel, getTeamSizeLabel, isGenderCompatible, useModalities, type Modality } from "@/features/modality"
import { EmptyState, ErrorState } from "@/shared/components/request-states"
import { Avatar } from "@/shared/components/ui/avatar"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { resolvePhotoSrc } from "@/shared/utils/photo-src"

type Props = {
    seasonId?: string
    selectedId: string | null
    takenModalityIds: string[]
    gender: "MALE" | "FEMALE" | null | undefined
    onSelect: (modality: Modality) => void
}

function getBlockReason(modality: Modality, takenModalityIds: string[], gender: Props["gender"]) {
    if (takenModalityIds.includes(modality.modality_id)) return "Você já tem uma equipe nesta modalidade."
    if (!isGenderCompatible(modality.gender_mode, gender)) return "Indisponível para o seu perfil."
    return null
}

export function CreateTeamModalityStep({ seasonId, selectedId, takenModalityIds, gender, onSelect }: Props) {
    const modalities = useModalities(seasonId)

    if (modalities.isPending) {
        return (
            <div role="status" aria-busy="true" className="grid gap-3 sm:grid-cols-2">
                <span className="sr-only">Carregando modalidades…</span>
                {Array.from({ length: 4 }, (_, index) => (
                    <Skeleton key={index} className="h-24 rounded-xl" aria-hidden />
                ))}
            </div>
        )
    }
    if (modalities.isError) {
        return (
            <ErrorState
                title="Não foi possível carregar as modalidades."
                description="Verifique sua conexão e tente novamente."
                onRetry={() => modalities.refetch()}
            />
        )
    }

    const active = modalities.data.filter((modality) => modality.active)
    if (active.length === 0) return <EmptyState title="Nenhuma modalidade ativa nesta temporada." />

    return (
        <div role="radiogroup" aria-label="Modalidade" className="grid gap-3 sm:grid-cols-2">
            {active.map((modality) => {
                const reason = getBlockReason(modality, takenModalityIds, gender)
                const selected = modality.modality_id === selectedId
                return (
                    <button
                        key={modality.modality_id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={reason !== null}
                        onClick={() => onSelect(modality)}
                        className={cn(
                            "relative flex min-h-24 items-start gap-3 rounded-xl border-2 p-4 text-left outline-none transition focus-visible:ring-3 focus-visible:ring-ring/40",
                            selected ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary-muted",
                            reason && "cursor-not-allowed opacity-60 hover:border-border",
                        )}
                    >
                        <Avatar name={modality.name} src={resolvePhotoSrc(modality.photo)} />
                        <span className="min-w-0 flex-1">
                            <span className="type-section block truncate text-ink">{modality.name}</span>
                            <span className="type-body-sm block text-muted-foreground">
                                {getGenderModeLabel(modality.gender_mode)} · {getTeamSizeLabel(modality)}
                            </span>
                            {reason && <span className="type-body-sm mt-1 block text-danger">{reason}</span>}
                        </span>
                        {selected && <Check className="size-5 shrink-0 text-primary" aria-hidden />}
                    </button>
                )
            })}
        </div>
    )
}
