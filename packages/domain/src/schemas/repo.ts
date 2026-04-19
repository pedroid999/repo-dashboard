import { z } from "zod"

import { Pipeline } from "@workspace/domain/schemas/pipeline"

export const Repo = z.object({
  name: z.string(),
  owner: z.string(),
  pipelines: z.array(Pipeline),
})

export type Repo = z.infer<typeof Repo>
