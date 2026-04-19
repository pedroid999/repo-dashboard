import { MockDataSource, platformCoreFixture } from "@workspace/domain"
import type { Dataset } from "@workspace/domain"

export const dataSource = new MockDataSource(platformCoreFixture)

export function getDataset(): Dataset {
  return dataSource.getDataset()
}
