import type { Dataset } from "@workspace/domain/schemas/dataset"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import type { Repo } from "@workspace/domain/schemas/repo"

export type DataSource = {
  getDataset(): Promise<Dataset>
  listRepos(): Promise<Repo[]>
  listMRs(): Promise<MergeRequest[]>
  getRepo(name: string): Promise<Repo | undefined>
}
