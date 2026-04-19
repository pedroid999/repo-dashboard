import { MockDataSource, platformCoreFixture } from "@workspace/domain"
import type { DataSource, Dataset } from "@workspace/domain"
import { GitLabDataSource } from "@workspace/domain/sources/gitlab/index"

type Mode = "mock" | "gitlab"

function resolveMode(raw: string | undefined): Mode {
  if (!raw || raw === "mock") return "mock"
  if (raw === "gitlab") return "gitlab"
  throw new Error(
    `DATA_SOURCE inválido: debe ser 'mock' o 'gitlab' (recibido: '${raw}').`
  )
}

function parseProjectIds(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
}

function buildDataSource(): DataSource {
  const mode = resolveMode(process.env.DATA_SOURCE)
  if (mode === "mock") {
    return new MockDataSource(platformCoreFixture)
  }

  const token = process.env.GITLAB_TOKEN
  if (!token) {
    throw new Error(
      "GITLAB_TOKEN is required when DATA_SOURCE=gitlab."
    )
  }
  const projectIds = parseProjectIds(process.env.GITLAB_PROJECT_IDS)
  if (projectIds.length === 0) {
    throw new Error(
      "GITLAB_PROJECT_IDS must list at least one project when DATA_SOURCE=gitlab."
    )
  }
  const host = process.env.GITLAB_HOST ?? "https://gitlab.com"
  return new GitLabDataSource({ host, token, projectIds })
}

export const dataSource: DataSource = buildDataSource()

export function getDataset(): Promise<Dataset> {
  return dataSource.getDataset()
}
