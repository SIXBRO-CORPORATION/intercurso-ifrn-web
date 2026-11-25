"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { href } from "@/core/routes/route-registry"
import { useAllModalities } from "@/features/modality"
import { cn } from "@/lib/utils"
import { ErrorState, ListSkeleton } from "@/shared/components/request-states"
import { Alert, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { fieldClass } from "@/shared/components/ui/field-class"
import { useCreateSeason } from "../hooks/use-seasons"
import { createSeasonFormSchema, type CreateSeasonForm, type CreateSeasonFormInput } from "../schemas/season-schema"
import { parseCreateSeasonError, RULES_DOCUMENT_ACCEPT, validateRulesDocument } from "../utils/create-season"

const labelClass = "type-small font-semibold text-text-secondary"

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="type-small text-danger-text">
      {message}
    </p>
  ) : null
}

export function CreateSeasonForm() {
  const router = useRouter()
  const modalities = useAllModalities()
  const create = useCreateSeason()
  const [document, setDocument] = useState<File | null>(null)
  const [documentError, setDocumentError] = useState<string | null>(null)

  const form = useForm<CreateSeasonFormInput, unknown, CreateSeasonForm>({
    resolver: zodResolver(createSeasonFormSchema),
    defaultValues: {
      name: "",
      year: String(new Date().getFullYear()),
      modality_ids: [],
      open_immediately: false,
      registration_start_date: "",
      registration_end_date: "",
    },
  })
  const openImmediately = useWatch({ control: form.control, name: "open_immediately" })
  const { errors } = form.formState
  const pending = create.isPending

  if (modalities.isPending) return <ListSkeleton label="Carregando modalidades…" count={3} />
  if (modalities.isError) {
    return <ErrorState title="Não foi possível carregar as modalidades." onRetry={() => modalities.refetch()} />
  }
  const active = modalities.data.filter((modality) => modality.active)

  const onSubmit = (values: CreateSeasonForm) => {
    if (documentError) return
    create.mutate(
      { ...values, rules_document: document },
      { onSuccess: (season) => router.push(href("season", { id: season.season_id })) },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Card className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <div className="space-y-1.5">
            <label htmlFor="season-name" className={labelClass}>
              Nome <span className="text-danger-text">*</span>
            </label>
            <input
              id="season-name"
              className={fieldClass}
              disabled={pending}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby="season-name-error"
              placeholder="Intercurso 2027"
              {...form.register("name")}
            />
            <FieldError id="season-name-error" message={errors.name?.message} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="season-year" className={labelClass}>
              Ano <span className="text-danger-text">*</span>
            </label>
            <input
              id="season-year"
              type="number"
              inputMode="numeric"
              className={fieldClass}
              disabled={pending}
              aria-invalid={errors.year ? true : undefined}
              aria-describedby="season-year-error"
              {...form.register("year")}
            />
            <FieldError id="season-year-error" message={errors.year?.message} />
          </div>
        </div>

        <fieldset className="space-y-2" aria-describedby="season-modalities-error">
          <legend className={labelClass}>
            Modalidades <span className="text-danger-text">*</span>
          </legend>
          {active.length === 0 ? (
            <p className="type-small text-muted-foreground">Nenhuma modalidade ativa cadastrada.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {active.map((modality) => (
                <label
                  key={modality.modality_id}
                  className="flex items-center gap-2 rounded-md bg-sunken px-3 py-2 text-sm"
                >
                  <input type="checkbox" value={modality.modality_id} disabled={pending} {...form.register("modality_ids")} />
                  {modality.name}
                </label>
              ))}
            </div>
          )}
          <FieldError id="season-modalities-error" message={errors.modality_ids?.message} />
        </fieldset>
      </Card>

      <Card className="space-y-4 p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" disabled={pending} {...form.register("open_immediately")} />
          Abrir inscrições imediatamente
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={cn("space-y-1.5", openImmediately && "opacity-50")}>
            <label htmlFor="season-start" className={labelClass}>
              Abertura das inscrições {!openImmediately && <span className="text-danger-text">*</span>}
            </label>
            <input
              id="season-start"
              type="datetime-local"
              className={fieldClass}
              disabled={pending || openImmediately}
              aria-invalid={errors.registration_start_date ? true : undefined}
              aria-describedby="season-start-error"
              {...form.register("registration_start_date")}
            />
            <FieldError id="season-start-error" message={errors.registration_start_date?.message} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="season-end" className={labelClass}>
              Encerramento das inscrições <span className="text-danger-text">*</span>
            </label>
            <input
              id="season-end"
              type="datetime-local"
              className={fieldClass}
              disabled={pending}
              aria-invalid={errors.registration_end_date ? true : undefined}
              aria-describedby="season-end-error"
              {...form.register("registration_end_date")}
            />
            <FieldError id="season-end-error" message={errors.registration_end_date?.message} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="season-rules" className={labelClass}>
            Regulamento <span className="font-normal text-muted-foreground">(opcional · PDF ou DOCX até 10 MB)</span>
          </label>
          <input
            id="season-rules"
            type="file"
            accept={RULES_DOCUMENT_ACCEPT}
            disabled={pending}
            aria-invalid={documentError ? true : undefined}
            aria-describedby="season-rules-error"
            className="block w-full text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              setDocument(file)
              setDocumentError(file && validateRulesDocument(file))
            }}
          />
          <FieldError id="season-rules-error" message={documentError ?? undefined} />
        </div>
      </Card>

      {create.isError && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>{parseCreateSeasonError(create.error)}</AlertTitle>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Criando…" : "Criar temporada"}
        </Button>
      </div>
    </form>
  )
}
