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
  group_name: z.string().nullish().transform((v) => v ?? null),
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

const matchSetSchema = z.object({
  set_number: z.number().int(),
  team1_points: z.number(),
  team2_points: z.number(),
})

const matchPlayerSchema = z.object({ user_id: z.string(), name: z.string() })

const matchEventSchema = z.object({
  event_id: z.string(),
  event_type: z.string(),
  clock_seconds: z.number(),
  team_id: z.string().nullish(),
  player_id: z.string().nullish(),
})

const modalityConfigurationSchema = z.object({
  num_periods: z.number().nullish(),
  period_duration_minutes: z.number().nullish(),
  score_type: z.string().nullish(),
  sets_to_win: z.number().nullish(),
})

export const matchDetailSchema = matchSchema.extend({
  modality_configuration: modalityConfigurationSchema.nullish(),
  sets: z.array(matchSetSchema),
  team1_players: z.array(matchPlayerSchema),
  team2_players: z.array(matchPlayerSchema),
  timeline: z.array(matchEventSchema),
})

export const matchDetailResponseSchema = envelopeSchema(matchDetailSchema)

export const matchLiveEventSchema = z.object({ match: matchDetailSchema.nullable() })

export type MatchDetail = z.infer<typeof matchDetailSchema>
export type MatchPlayer = z.infer<typeof matchPlayerSchema>
