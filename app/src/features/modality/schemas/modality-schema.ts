import { z } from "zod"
import { envelopeSchema } from "@/shared/schemas/envelope-schema"

export const modalitySchema = z.object({
  modality_id: z.string(),
  name: z.string(),
  active: z.boolean().optional(),
})

export const modalityListSchema = envelopeSchema(z.array(modalitySchema))

export type Modality = z.infer<typeof modalitySchema>
