import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const modalityTeamSchema = z.object({
  team_id: z.string(),
  name: z.string(),
  modality_id: z.string(),
  photo: z.string().nullish(),
  members_count: z.number().int().nullish().transform((value) => value ?? 0),
  max_members: z.number().int().nullish(),
})

export const modalityTeamListSchema = envelopeSchema(z.array(modalityTeamSchema).nullable())

export type ModalityTeam = z.infer<typeof modalityTeamSchema>
