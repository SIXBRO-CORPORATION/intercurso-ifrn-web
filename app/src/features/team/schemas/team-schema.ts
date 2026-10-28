import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const TEAM_STATUSES = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const

export const teamSummarySchema = z.object({
    team_id: z.string(),
    name: z.string(),
    modality_id: z.string(),
    modality_name: z.string().nullish(),
    season_id: z.string().nullish(),
    status: z.enum(TEAM_STATUSES),
    owner_id: z.string().nullish(),
    captain_id: z.string().nullish(),
    photo: z.string().nullish(),
    members_count: z.number().int().nullish().transform((value) => value ?? 0),
    max_members: z.number().int().nullish(),
})

export const teamListSchema = envelopeSchema(z.array(teamSummarySchema).nullable())

export type TeamStatus = (typeof TEAM_STATUSES)[number]
export type TeamSummary = z.infer<typeof teamSummarySchema>