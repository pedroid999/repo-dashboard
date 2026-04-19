import type { Pipeline } from "@workspace/domain/schemas/pipeline"

export interface StatusCounts {
  passed: number
  failed: number
  running: number
}

export function countByStatus(pipelines: Pipeline[]): StatusCounts {
  return pipelines.reduce<StatusCounts>(
    (acc, p) => {
      acc[p.status] += 1
      return acc
    },
    { passed: 0, failed: 0, running: 0 }
  )
}
