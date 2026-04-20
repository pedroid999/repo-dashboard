import "server-only"

import type {
  GitLabCommit,
  GitLabGroupProject,
  GitLabJob,
  GitLabMergeRequest,
  GitLabMergeRequestApprovals,
  GitLabPipeline,
  GitLabProject,
} from "@workspace/domain/sources/gitlab/types"

export interface GitLabClientConfig {
  host: string
  token: string
}

const REVALIDATE_PROJECT = 300
const REVALIDATE_RECENT = 60

export class GitLabError extends Error {
  public readonly status: number
  public readonly path: string

  constructor({
    status,
    path,
    message,
  }: {
    status: number
    path: string
    message: string
  }) {
    super(message)
    this.name = "GitLabError"
    this.status = status
    this.path = path
  }
}

export class GitLabClient {
  private readonly host: string
  private readonly token: string

  constructor(config: GitLabClientConfig) {
    this.host = config.host.replace(/\/$/, "")
    this.token = config.token
  }

  async getProject(projectId: string): Promise<GitLabProject> {
    return this.request<GitLabProject>(
      `/projects/${encodeProjectId(projectId)}`,
      REVALIDATE_PROJECT
    )
  }

  async getPipelines(projectId: string): Promise<GitLabPipeline[]> {
    const query = new URLSearchParams({
      per_page: "20",
      order_by: "id",
      sort: "desc",
    })
    return this.request<GitLabPipeline[]>(
      `/projects/${encodeProjectId(projectId)}/pipelines?${query.toString()}`,
      REVALIDATE_RECENT
    )
  }

  async getJobs(projectId: string, pipelineId: number): Promise<GitLabJob[]> {
    const query = new URLSearchParams({ per_page: "100" })
    return this.request<GitLabJob[]>(
      `/projects/${encodeProjectId(projectId)}/pipelines/${pipelineId}/jobs?${query.toString()}`,
      REVALIDATE_RECENT
    )
  }

  async getCommit(projectId: string, sha: string): Promise<GitLabCommit> {
    return this.request<GitLabCommit>(
      `/projects/${encodeProjectId(projectId)}/repository/commits/${encodeURIComponent(sha)}`,
      REVALIDATE_RECENT
    )
  }

  async getMergeRequests(projectId: string): Promise<GitLabMergeRequest[]> {
    const query = new URLSearchParams({
      state: "opened",
      per_page: "50",
    })
    return this.request<GitLabMergeRequest[]>(
      `/projects/${encodeProjectId(projectId)}/merge_requests?${query.toString()}`,
      REVALIDATE_RECENT
    )
  }

  async getGroupProjects(groupId: string): Promise<GitLabGroupProject[]> {
    const query = new URLSearchParams({
      per_page: "100",
      with_shared: "false",
    })
    return this.request<GitLabGroupProject[]>(
      `/groups/${encodeProjectId(groupId)}/projects?${query.toString()}`,
      REVALIDATE_PROJECT
    )
  }

  async getMergeRequestApprovals(
    projectId: string,
    mrIid: number
  ): Promise<GitLabMergeRequestApprovals> {
    return this.request<GitLabMergeRequestApprovals>(
      `/projects/${encodeProjectId(projectId)}/merge_requests/${mrIid}/approvals`,
      REVALIDATE_RECENT
    )
  }

  private async request<T>(path: string, revalidate: number): Promise<T> {
    const url = `${this.host}/api/v4${path}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "PRIVATE-TOKEN": this.token,
        Accept: "application/json",
      },
      next: { revalidate },
    } as RequestInit & { next: { revalidate: number } })

    if (!response.ok) {
      throw new GitLabError({
        status: response.status,
        path,
        message: `GitLab API request failed: ${response.status} ${response.statusText || ""}`.trim(),
      })
    }
    return (await response.json()) as T
  }
}

function encodeProjectId(id: string): string {
  if (/^\d+$/.test(id)) return id
  return encodeURIComponent(id)
}
