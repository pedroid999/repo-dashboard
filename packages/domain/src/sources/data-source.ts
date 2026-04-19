import type { Dataset } from "@workspace/domain/schemas/dataset"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import type { Repo } from "@workspace/domain/schemas/repo"

export type DataSource = {
  getDataset(): Dataset
  listRepos(): Repo[]
  listMRs(): MergeRequest[]
  getRepo(name: string): Repo | undefined
}
