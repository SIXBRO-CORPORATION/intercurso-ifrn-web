import { z } from "zod"
import { MATCH_STATUSES } from "./match-schema"

export const matchFiltersFormSchema = z
  .object({
    status: z.enum(MATCH_STATUSES).or(z.literal("")),
    date_from: z.string(),
    date_to: z.string(),
  })
  .refine((v) => !v.date_from || !v.date_to || v.date_from <= v.date_to, {
    path: ["date_to"],
    message: "A data final deve ser igual ou posterior à inicial.",
  })

export type MatchFiltersForm = z.infer<typeof matchFiltersFormSchema>
