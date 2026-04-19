import { z } from "zod"

import { CiStatus } from "@workspace/domain/schemas/status"

export const MergeRequest = z.object({
  repo: z.string(),
  id: z.number().int(),
  title: z.string(),
  author: z.string(),
  from: z.string(),
  to: z.string(),
  reviewers: z.array(z.string()),
  ci: CiStatus,
  days: z.number().int(),
  approvals: z.string(),
  conflicts: z.boolean().optional(),
  stale: z.boolean().optional(),
})

export type MergeRequest = z.infer<typeof MergeRequest>
