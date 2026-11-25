"use client"

import { useRef } from "react"
import { Camera, Info, X } from "lucide-react"
import { useWatch, type UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { getTeamSizeLabel, type Modality } from "@/features/modality"
import { Alert, AlertTitle } from "@/shared/components/ui/alert"
import { Avatar } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { fieldClass } from "@/shared/components/ui/field-class"
import { TEAM_NAME_MAX, TEAM_PHOTO_TYPES } from "../constants"
import type { CreateTeamForm } from "../schemas/team-schema"

export const CREATE_TEAM_FORM_ID = "create-team-form"

type Props = {
    form: UseFormReturn<CreateTeamForm>
    modality: Modality
    seasonName: string
    photoUrl: string | null
    photoError: string | null
    disabled: boolean
    onPhotoSelect: (file: File | undefined) => void
    onPhotoRemove: () => void
    onSubmit: (values: CreateTeamForm) => void
}

export function CreateTeamDetailsStep({
    form,
    modality,
    seasonName,
    photoUrl,
    photoError,
    disabled,
    onPhotoSelect,
    onPhotoRemove,
    onSubmit,
}: Props) {
    const fileInput = useRef<HTMLInputElement>(null)
    const name = useWatch({ control: form.control, name: "name" })
    const nameError = form.formState.errors.name?.message

    return (
        <form id={CREATE_TEAM_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-[9rem_1fr]">
                <div className="flex flex-col items-center gap-2 text-center">
                    <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        aria-label={photoUrl ? "Trocar logo da equipe" : "Adicionar logo da equipe"}
                        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
                    >
                        <Avatar className="size-16" src={photoUrl}>
                            {photoUrl ? undefined : <Camera className="size-6" aria-hidden />}
                        </Avatar>
                    </button>
                    <input
                        ref={fileInput}
                        type="file"
                        accept={TEAM_PHOTO_TYPES.join(",")}
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden
                        onChange={(event) => {
                            onPhotoSelect(event.target.files?.[0])
                            event.target.value = ""
                        }}
                    />
                    <span className="type-h3">{photoUrl ? "Trocar logo" : "Adicionar logo"}</span>
                    <span className="type-small text-muted-foreground">opcional · PNG, JPG ou WEBP até 5 MB</span>
                    {photoUrl && (
                        <Button type="button" variant="ghost" size="sm" onClick={onPhotoRemove}>
                            <X aria-hidden /> Remover
                        </Button>
                    )}
                    {photoError && (
                        <p role="alert" className="type-small text-danger-text">
                            {photoError}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                            <label htmlFor="team-name" className="type-small font-semibold text-text-secondary">
                                Nome da equipe <span className="text-danger-text">*</span>
                            </label>
                            <span className="type-small text-muted-foreground" aria-hidden>
                                {name.length}/{TEAM_NAME_MAX}
                            </span>
                        </div>
                        <input
                            id="team-name"
                            type="text"
                            autoComplete="off"
                            maxLength={TEAM_NAME_MAX}
                            disabled={disabled}
                            aria-invalid={nameError ? true : undefined}
                            aria-describedby="team-name-help"
                            className={fieldClass}
                            {...form.register("name")}
                        />
                        <p id="team-name-help" role={nameError ? "alert" : undefined} className={cn("type-small", nameError ? "text-danger-text" : "text-muted-foreground")}>
                            {nameError ?? "Use um nome único para a sua equipe."}
                        </p>
                    </div>

                    <Card asChild className="rounded-md bg-sunken">
                        <dl className="divide-y divide-border px-4 py-1">
                            {[
                                ["Modalidade", modality.name],
                                ["Temporada", seasonName],
                                ["Integrantes", getTeamSizeLabel(modality)],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                                    <dt className="type-small text-text-secondary">{label}</dt>
                                    <dd className="type-h3 text-right">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                </div>
            </div>

            <Alert variant="success" role="status">
                <Info aria-hidden />
                <AlertTitle>Você será o dono da equipe e receberá um link de convite.</AlertTitle>
            </Alert>
        </form>
    )
}
