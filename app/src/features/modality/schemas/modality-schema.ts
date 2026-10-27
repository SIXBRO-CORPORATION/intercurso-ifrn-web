import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const GENDER_MODES = ["MALE", "FEMALE", "MIXED"] as const

export const modalitySchema = z.object({
  modality_id: z.string(),
  name: z.string(),
  min_members: z.number().int(),
  max_members: z.number().int(),
  gender_mode: z.enum(GENDER_MODES),
  min_male_members: z.number().int().nullish(),
  min_female_members: z.number().int().nullish(),
  active: z.boolean(),
  photo: z.string().nullish(),
})

export const modalityListSchema = envelopeSchema(z.array(modalitySchema).nullable())

export type Modality = z.infer<typeof modalitySchema>
export type GenderMode = (typeof GENDER_MODES)[number]
