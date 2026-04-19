import { z } from "zod"

import { MergeRequest } from "@workspace/domain/schemas/mr"
import { Repo } from "@workspace/domain/schemas/repo"

export const Dataset = z
  .object({
    project: z.string(),
    repos: z.array(Repo),
    mrs: z.array(MergeRequest),
  })
  .superRefine((value, ctx) => {
    const repoNames = new Set(value.repos.map((repo) => repo.name))
    value.mrs.forEach((mr, index) => {
      if (!repoNames.has(mr.repo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mrs", index, "repo"],
          message: `MR references unknown repo: ${mr.repo}`,
        })
      }
    })
  })

export type Dataset = z.infer<typeof Dataset>
