import type { Dataset } from "@workspace/domain/schemas/dataset"
import type { Pipeline } from "@workspace/domain/schemas/pipeline"

export function listPipelines(dataset: Dataset): (Pipeline & { repo: string })[] {
  return dataset.repos.flatMap((repo) =>
    repo.pipelines.map((pipeline) => ({ ...pipeline, repo: repo.name }))
  )
}
