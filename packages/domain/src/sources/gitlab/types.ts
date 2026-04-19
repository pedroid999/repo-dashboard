/**
 * Minimal GitLab REST API types — only fields actually consumed by the adapter.
 * Not a complete binding; see https://docs.gitlab.com/ee/api/ for the full shape.
 */

export interface GitLabUser {
  username: string
}

export interface GitLabProject {
  id: number
  name: string
  path_with_namespace: string
  namespace?: { full_path?: string; path?: string }
  topics?: string[]
}

export interface GitLabPipeline {
  id: number
  sha: string
  ref: string
  status: string
  duration: number | null
  created_at: string
  user?: GitLabUser | null
}

export interface GitLabJob {
  id: number
  name: string
  stage: string
  status: string
}

export interface GitLabCommit {
  id: string
  short_id: string
  title: string
  author_name: string
}

export interface GitLabHeadPipeline {
  status: string
}

export interface GitLabMergeRequest {
  iid: number
  title: string
  author: GitLabUser
  source_branch: string
  target_branch: string
  reviewers?: GitLabUser[]
  head_pipeline: GitLabHeadPipeline | null
  created_at: string
  has_conflicts?: boolean
  draft?: boolean
}

export interface GitLabMergeRequestApprovals {
  approvals_required: number
  approvals_left: number
}
