import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"
import { TEAM_NAME_MAX, TEAM_NAME_MIN } from "../constants"

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

export const createTeamFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(TEAM_NAME_MIN, `Use pelo menos ${TEAM_NAME_MIN} caracteres.`)
        .max(TEAM_NAME_MAX, `Use no máximo ${TEAM_NAME_MAX} caracteres.`),
})

export const createdTeamSchema = z.object({
    team_id: z.string(),
    name: z.string(),
    modality_id: z.string(),
    status: z.enum(TEAM_STATUSES),
    photo: z.string().nullish(),
    invite_token: z.string().nullish(),
    owner_id: z.string(),
})

export const createdTeamResponseSchema = envelopeSchema(createdTeamSchema)

export type CreateTeamForm = z.infer<typeof createTeamFormSchema>
export type CreatedTeam = z.infer<typeof createdTeamSchema>
