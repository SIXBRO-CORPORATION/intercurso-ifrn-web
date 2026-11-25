"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronRight, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/contexts/auth-context"
import type { Modality } from "@/features/modality"
import { useRegistrationOpen, type Season } from "@/features/season"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/shared/components/ui/dialog"
import { useCreateTeam } from "../hooks/use-create-team"
import { createTeamFormSchema, type CreatedTeam, type CreateTeamForm } from "../schemas/team-schema"
import { parseCreateTeamError, validateTeamPhoto } from "../utils/create-team"
import { CREATE_TEAM_FORM_ID, CreateTeamDetailsStep } from "./create-team-details-step"
import { CreateTeamInviteStep } from "./create-team-invite-step"
import { CreateTeamModalityStep } from "./create-team-modality-step"

type Step = "modality" | "details" | "invite"
type Photo = { file: File; url: string }
type Props = { season: Season; takenModalityIds: string[]; onClose: () => void }

const STEPS = ["Modalidade", "Dados da equipe"]
const DESCRIPTIONS: Record<Step, string> = {
    modality: "Escolha a modalidade da sua equipe.",
    details: "Dê um nome e uma identidade para sua equipe.",
    invite: "Tudo pronto para chamar a galera.",
}

function Stepper({ current }: { current: number }) {
    return (
        <ol className="grid grid-cols-2 gap-3" aria-label="Etapas">
            {STEPS.map((label, index) => (
                <li key={label} aria-current={index === current ? "step" : undefined} className="space-y-1.5">
                    <span className={cn("block h-1.5 rounded-full", index <= current ? "bg-primary" : "bg-border")} />
                    <span className={cn("type-label flex items-center gap-1.5", index <= current ? "text-ink" : "text-faint")}>
                        {index < current && <Check className="size-4 text-primary" aria-hidden />}
                        {label}
                    </span>
                </li>
            ))}
        </ol>
    )
}

export function CreateTeamDialog({ season, takenModalityIds, onClose }: Props) {
    const { user } = useAuth()
    const create = useCreateTeam()
    const registrationOpen = useRegistrationOpen(season)
    const form = useForm<CreateTeamForm>({ resolver: zodResolver(createTeamFormSchema), defaultValues: { name: "" } })

    const [step, setStep] = useState<Step>("modality")
    const [modality, setModality] = useState<Modality | null>(null)
    const [photo, setPhoto] = useState<Photo | null>(null)
    const [photoError, setPhotoError] = useState<string | null>(null)
    const [created, setCreated] = useState<CreatedTeam | null>(null)

    function discardPhoto() {
        if (photo) URL.revokeObjectURL(photo.url)
        setPhoto(null)
    }

    function close() {
        discardPhoto()
        onClose()
    }

    function selectPhoto(file: File | undefined) {
        if (!file) return
        const error = validateTeamPhoto(file)
        setPhotoError(error)
        if (error) return
        discardPhoto()
        setPhoto({ file, url: URL.createObjectURL(file) })
    }

    function submit({ name }: CreateTeamForm) {
        if (!modality || !registrationOpen) return
        create.mutate(
            { name, modalityId: modality.modality_id, photo: photo?.file },
            {
                onSuccess: (team) => {
                    setCreated(team)
                    setStep("invite")
                },
            },
        )
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open && !create.isPending) close()
            }}
        >
            <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto">
                <div>
                    <DialogTitle>Criar equipe</DialogTitle>
                    <DialogDescription>{DESCRIPTIONS[step]}</DialogDescription>
                </div>
                {step !== "invite" && <Stepper current={step === "modality" ? 0 : 1} />}
                {step !== "invite" && !registrationOpen && (
                    <Alert variant="warning">
                        <Clock aria-hidden />
                        <AlertTitle>As inscrições foram encerradas.</AlertTitle>
                        <AlertDescription>Não é mais possível criar equipes nesta temporada.</AlertDescription>
                    </Alert>
                )}

                {step === "modality" && (
                    <CreateTeamModalityStep
                        seasonId={season.season_id}
                        selectedId={modality?.modality_id ?? null}
                        takenModalityIds={takenModalityIds}
                        gender={user?.gender}
                        onSelect={setModality}
                    />
                )}
                {step === "details" && modality && (
                    <>
                        <CreateTeamDetailsStep
                            form={form}
                            modality={modality}
                            seasonName={season.name}
                            photoUrl={photo?.url ?? null}
                            photoError={photoError}
                            disabled={create.isPending}
                            onPhotoSelect={selectPhoto}
                            onPhotoRemove={() => {
                                discardPhoto()
                                setPhotoError(null)
                            }}
                            onSubmit={submit}
                        />
                        {create.isError && (
                            <div role="alert" className="type-body-sm rounded-lg bg-danger-soft px-4 py-3 text-danger">
                                {parseCreateTeamError(create.error)}
                            </div>
                        )}
                    </>
                )}
                {step === "invite" && created && <CreateTeamInviteStep team={created} />}

                <DialogFooter>
                    {step === "modality" && (
                        <>
                            <Button type="button" variant="neutral" onClick={close}>
                                Cancelar
                            </Button>
                            <Button type="button" disabled={!modality || !registrationOpen} onClick={() => setStep("details")}>
                                Continuar <ChevronRight aria-hidden />
                            </Button>
                        </>
                    )}
                    {step === "details" && (
                        <>
                            <Button type="button" variant="neutral" disabled={create.isPending} onClick={() => setStep("modality")}>
                                Voltar
                            </Button>
                            <Button type="submit" form={CREATE_TEAM_FORM_ID} disabled={create.isPending || !registrationOpen}>
                                <Check aria-hidden /> {create.isPending ? "Criando…" : "Criar equipe"}
                            </Button>
                        </>
                    )}
                    {step === "invite" && <Button type="button" onClick={close}>Concluir</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
