import type { Dataset } from "@workspace/domain/schemas/dataset"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import type { Repo } from "@workspace/domain/schemas/repo"
import type { DataSource } from "@workspace/domain/sources/data-source"
import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"

export class MockDataSource implements DataSource {
  private readonly dataset: Dataset

  constructor(dataset: Dataset = platformCoreFixture) {
    this.dataset = dataset
  }

  getDataset(): Promise<Dataset> {
    return Promise.resolve(this.dataset)
  }

  listRepos(): Promise<Repo[]> {
    return Promise.resolve(this.dataset.repos)
  }

  listMRs(): Promise<MergeRequest[]> {
    return Promise.resolve(this.dataset.mrs)
  }

  getRepo(name: string): Promise<Repo | undefined> {
    return Promise.resolve(this.dataset.repos.find((repo) => repo.name === name))
  }
}
