import { z } from "zod"

export const envelopeSchema = <T extends z.ZodType>(data: T) => z.object({ data })
