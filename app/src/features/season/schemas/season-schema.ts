import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const SEASON_STATUSES = [
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
})

export const activeSeasonsSchema = envelopeSchema(z.union([seasonSchema, z.array(seasonSchema)]).nullable()).transform(
    ({ data }) => (data === null ? [] : Array.isArray(data) ? data : [data]),
)

export type Season = z.infer<typeof seasonSchema>
export type SeasonStatus = Season["status"]