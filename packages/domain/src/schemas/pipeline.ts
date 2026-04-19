import { z } from "zod"

import { Stage, Status } from "@workspace/domain/schemas/status"

export const Pipeline = z.object({
  branch: z.string(),
  id: z.number().int(),
  status: Status,
  dur: z.string(),
  age: z.string(),
  author: z.string(),
  commit: z.string(),
  title: z.string(),
  stages: z.array(Stage),
})

export type Pipeline = z.infer<typeof Pipeline>
