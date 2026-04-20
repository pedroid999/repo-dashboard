import "server-only"

import type { Dataset } from "@workspace/domain/schemas/dataset"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import type { Pipeline } from "@workspace/domain/schemas/pipeline"
import type { Repo } from "@workspace/domain/schemas/repo"
import type { DataSource } from "@workspace/domain/sources/data-source"
import { GitLabClient } from "@workspace/domain/sources/gitlab/client"
import { warn } from "@workspace/domain/sources/gitlab/log"
import { mapMergeRequest, mapPipeline } from "@workspace/domain/sources/gitlab/mappers"
import type { GitLabProject } from "@workspace/domain/sources/gitlab/types"

// Known GitLab pipeline statuses. A pipeline whose `status` is outside this
// set is treated as a partial failure by the adapter: skipped + warn. This
// is stricter than the mapper's defensive coercion (GL-6) — per GL-5, the
// adapter must preserve the rest of the dataset when a record is malformed.
const KNOWN_PIPELINE_STATUSES = new Set([
  "success",
  "failed",
  "canceled",
  "running",
  "pending",
  "preparing",
])

export interface GitLabDataSourceConfig {
  host: string
  token: string
  projectIds: string[]
  groupIds?: string[]
}

export class GitLabDataSource implements DataSource {
  private readonly client: GitLabClient
  private readonly projectIds: string[]
  private readonly groupIds: string[]

  constructor(config: GitLabDataSourceConfig) {
    this.client = new GitLabClient({ host: config.host, token: config.token })
    this.projectIds = config.projectIds
    this.groupIds = config.groupIds ?? []
  }

  private async resolveProjectIds(): Promise<string[]> {
    if (this.groupIds.length === 0) return this.projectIds

    const allIds = [...this.projectIds]
    const seen = new Set(this.projectIds)

    const groupProjectArrays = await Promise.all(
      this.groupIds.map((id) => this.client.getGroupProjects(id))
    )
    for (const projects of groupProjectArrays) {
      for (const p of projects) {
        const id = String(p.id)
        if (!seen.has(id)) {
          seen.add(id)
          allIds.push(id)
        }
      }
    }
    return allIds
  }

  async getDataset(): Promise<Dataset> {
    const now = Date.now()
    const repos: Repo[] = []
    const mrs: MergeRequest[] = []

    const perProject = await Promise.all(
      (await this.resolveProjectIds()).map((projectId) =>
        this.fetchProject(projectId, now)
      )
    )

    let projectLabel = "gitlab"
    for (const entry of perProject) {
      repos.push(entry.repo)
      mrs.push(...entry.mrs)
      projectLabel = entry.projectName ?? projectLabel
    }

    return {
      project: perProject.length === 1 ? projectLabel : "gitlab",
      repos,
      mrs,
    }
  }

  async listRepos(): Promise<Repo[]> {
    const dataset = await this.getDataset()
    return dataset.repos
  }

  async listMRs(): Promise<MergeRequest[]> {
    const dataset = await this.getDataset()
    return dataset.mrs
  }

  async getRepo(name: string): Promise<Repo | undefined> {
    const repos = await this.listRepos()
    return repos.find((repo) => repo.name === name)
  }

  private async fetchProject(
    projectId: string,
    now: number
  ): Promise<{ repo: Repo; mrs: MergeRequest[]; projectName: string }> {
    const [project, rawPipelines, rawMrs] = await Promise.all([
      this.client.getProject(projectId),
      this.client.getPipelines(projectId),
      this.client.getMergeRequests(projectId),
    ])

    const pipelines = await this.mapPipelines(projectId, rawPipelines, now)
    const repo: Repo = {
      name: project.name,
      owner: repoOwner(project),
      pipelines,
    }

    const mrs = await this.mapMergeRequests(projectId, project.name, rawMrs, now)

    return { repo, mrs, projectName: project.name }
  }

  private async mapPipelines(
    projectId: string,
    rawPipelines: Awaited<ReturnType<GitLabClient["getPipelines"]>>,
    now: number
  ): Promise<Pipeline[]> {
    const results = await Promise.all(
      rawPipelines.map(async (pipeline) => {
        if (!KNOWN_PIPELINE_STATUSES.has(pipeline.status)) {
          warn({
            op: "map.pipeline",
            projectId,
            pipelineId: pipeline.id,
            reason: "unknown status",
            value: pipeline.status,
          })
          return undefined
        }
        try {
          const [jobs, commit] = await Promise.all([
            this.client.getJobs(projectId, pipeline.id),
            this.client.getCommit(projectId, pipeline.sha).catch((err) => {
              warn({
                op: "fetch.commit",
                projectId,
                sha: pipeline.sha,
                status: (err as { status?: number })?.status,
              })
              return undefined
            }),
          ])
          return mapPipeline(pipeline, jobs, commit, now)
        } catch (err) {
          warn({
            op: "map.pipeline",
            projectId,
            pipelineId: pipeline.id,
            error: (err as Error).message,
          })
          return undefined
        }
      })
    )
    return results.filter((p): p is Pipeline => p !== undefined)
  }

  private async mapMergeRequests(
    projectId: string,
    repoName: string,
    rawMrs: Awaited<ReturnType<GitLabClient["getMergeRequests"]>>,
    now: number
  ): Promise<MergeRequest[]> {
    const results = await Promise.all(
      rawMrs.map(async (mr) => {
        try {
          const approvals = await this.client
            .getMergeRequestApprovals(projectId, mr.iid)
            .catch(() => ({ approvals_required: 0, approvals_left: 0 }))
          return mapMergeRequest(repoName, mr, approvals, now)
        } catch (err) {
          warn({
            op: "map.mr",
            projectId,
            mrIid: mr.iid,
            error: (err as Error).message,
          })
          return undefined
        }
      })
    )
    return results.filter((mr): mr is MergeRequest => mr !== undefined)
  }
}

function repoOwner(project: GitLabProject): string {
  return (
    project.topics?.[0] ??
    project.namespace?.path ??
    project.path_with_namespace.split("/").slice(0, -1).join("/") ??
    "unknown"
  )
}
