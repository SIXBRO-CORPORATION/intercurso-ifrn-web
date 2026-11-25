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
