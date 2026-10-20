import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const MATCH_STATUSES = ["SCHEDULED", "IN_PROGRESS", "FINISHED"] as const

const matchTeamSchema = z.object({
  team_id: z.string(),
  name: z.string(),
  photo: z.string().nullable(),
  score: z.number(),
  sets_won: z.number().nullish(),
  penalty_score: z.number().nullish(),
})

export const matchSchema = z.object({
  match_id: z.string(),
  bracket_id: z.string().nullable(),
  modality_id: z.string(),
  modality_name: z.string(),
  group_name: z.string().nullable(),
  match_type: z.string().nullable(),
  match_category: z.string().nullable(),
  status: z.enum(MATCH_STATUSES),
  scheduled_date: z.string().nullable(),
  team1: matchTeamSchema.nullable(),
  team2: matchTeamSchema.nullable(),
  winner_id: z.string().nullable(),
  clock_seconds: z.number().nullable(),
  clock_running: z.boolean(),
  current_period: z.number().nullable(),
})

export const matchPageSchema = z.object({
  items: z.array(matchSchema),
  total: z.number().int(),
  page: z.number().int(),
  size: z.number().int(),
})

export const matchListSchema = envelopeSchema(matchPageSchema)

export type Match = z.infer<typeof matchSchema>
export type MatchTeam = NonNullable<Match["team1"]>
export type MatchStatus = Match["status"]
export type MatchPage = z.infer<typeof matchPageSchema>
