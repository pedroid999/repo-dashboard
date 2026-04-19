import { MockDataSource, platformCoreFixture } from "@workspace/domain"
import type { DataSource, Dataset } from "@workspace/domain"

export const dataSource: DataSource = new MockDataSource(platformCoreFixture)

export function getDataset(): Promise<Dataset> {
  return dataSource.getDataset()
}
