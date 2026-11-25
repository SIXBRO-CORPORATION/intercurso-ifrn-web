import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

const SEASON_STATUSES = [
  "DRAFT",
  "REGISTRATION_OPEN",
  "REGISTRATION_CLOSED",
  "IN_PROGRESS",
  "FINISHED",
] as const

export const seasonSchema = z.object({
  season_id: z.string(),
  name: z.string(),
  year: z.number().int(),
  status: z.enum(SEASON_STATUSES),
  active: z.boolean(),
  registration_start_date: z.string().nullish(),
  registration_end_date: z.string().nullish(),
})

export const activeSeasonSchema = envelopeSchema(seasonSchema.nullable())
export const seasonListSchema = envelopeSchema(z.array(seasonSchema).nullable())

export const seasonDetailSchema = seasonSchema.extend({
  modality_ids: z.array(z.string()),
  rules_document: z.string().nullish(),
})
export const seasonDetailResponseSchema = envelopeSchema(seasonDetailSchema)

export type Season = z.infer<typeof seasonSchema>
export type SeasonDetail = z.infer<typeof seasonDetailSchema>

export const createdSeasonResponseSchema = envelopeSchema(seasonSchema)

const dateTime = (message: string) => z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), message)

export const createSeasonFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome da temporada.").max(255, "Use no máximo 255 caracteres."),
    year: z.coerce.number<string>().int("Informe um ano válido.").min(new Date().getFullYear(), "O ano deve ser o atual ou posterior."),
    modality_ids: z.array(z.string()).min(1, "Selecione ao menos uma modalidade."),
    open_immediately: z.boolean(),
    registration_start_date: z.string(),
    registration_end_date: dateTime("Informe a data de encerramento das inscrições."),
  })
  .superRefine((form, ctx) => {
    const now = new Date()
    const start = form.open_immediately ? now : new Date(form.registration_start_date)
    if (!form.open_immediately && (Number.isNaN(start.getTime()) || start < now)) {
      ctx.addIssue({ code: "custom", path: ["registration_start_date"], message: "A abertura deve ser agora ou no futuro." })
      return
    }
    if (new Date(form.registration_end_date) <= start) {
      ctx.addIssue({ code: "custom", path: ["registration_end_date"], message: "O encerramento deve ser depois da abertura." })
    }
  })

export type CreateSeasonFormInput = z.input<typeof createSeasonFormSchema>
export type CreateSeasonForm = z.output<typeof createSeasonFormSchema>
