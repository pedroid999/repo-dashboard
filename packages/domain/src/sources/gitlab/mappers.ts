import type { Pipeline } from "@workspace/domain/schemas/pipeline"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import type { CiStatus, Stage, Status } from "@workspace/domain/schemas/status"
import { warn } from "@workspace/domain/sources/gitlab/log"
import type {
  GitLabCommit,
  GitLabJob,
  GitLabMergeRequest,
  GitLabMergeRequestApprovals,
  GitLabPipeline,
  GitLabUser,
} from "@workspace/domain/sources/gitlab/types"

export function mapPipelineStatus(raw: string): Status {
  switch (raw) {
    case "success":
      return "passed"
    case "failed":
    case "canceled":
      return "failed"
    case "running":
    case "pending":
    case "preparing":
      return "running"
    default:
      warn({ op: "map.pipeline.status", value: raw })
      return "running"
  }
}

function collapseJobStatus(raw: string): Stage {
  switch (raw) {
    case "success":
      return "ok"
    case "failed":
    case "canceled":
      return "fail"
    case "running":
    case "pending":
    case "preparing":
      return "run"
    case "skipped":
    case "manual":
    case "created":
    case "scheduled":
      return "skip"
    default:
      return "skip"
  }
}

const STAGE_PRIORITY: Stage[] = ["fail", "run", "ok", "skip"]

export function mapStages(jobs: GitLabJob[]): Stage[] {
  const byStage = new Map<string, Stage[]>()
  const order: string[] = []
  for (const job of jobs) {
    if (!byStage.has(job.stage)) {
      byStage.set(job.stage, [])
      order.push(job.stage)
    }
    byStage.get(job.stage)!.push(collapseJobStatus(job.status))
  }
  return order.map((stageName) => {
    const stages = byStage.get(stageName) ?? []
    for (const priority of STAGE_PRIORITY) {
      if (stages.includes(priority)) return priority
    }
    return "skip"
  })
}

export function formatDur(duration: number | null | undefined): string {
  const secs = duration ?? 0
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

export function formatAge(createdAt: string, now: number = Date.now()): string {
  const diff = now - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days >= 1) return `${days}d`
  if (hours >= 1) return `${hours}h`
  return `${Math.max(0, minutes)}m`
}

export function mapCommit(sha: string): string {
  return sha.slice(0, 8)
}

export function mapTitle(commit: GitLabCommit | undefined): string {
  return commit?.title ?? ""
}

export function mapMrCi(
  headPipeline: { status: string } | null | undefined,
  mrIid?: number
): CiStatus {
  if (!headPipeline) {
    warn({ op: "map.mr.ci", reason: "no head_pipeline", mrIid })
    return "run"
  }
  switch (headPipeline.status) {
    case "success":
      return "ok"
    case "failed":
    case "canceled":
      return "fail"
    case "running":
    case "pending":
    case "preparing":
      return "run"
    default:
      warn({ op: "map.mr.ci", value: headPipeline.status, mrIid })
      return "run"
  }
}

export function mapApprovals(required: number, left: number): string {
  const current = Math.max(0, required - left)
  return `${current}/${required}`
}

export function mapMrReviewers(
  reviewers: GitLabUser[] | null | undefined
): string[] {
  if (!reviewers || reviewers.length === 0) return []
  return reviewers.map((u) => u.username)
}

export function mapMrDays(createdAt: string, now: number = Date.now()): number {
  const diff = now - new Date(createdAt).getTime()
  return Math.floor(diff / 86_400_000)
}

export function mapPipeline(
  pipeline: GitLabPipeline,
  jobs: GitLabJob[],
  commit: GitLabCommit | undefined,
  now: number = Date.now()
): Pipeline {
  return {
    branch: pipeline.ref,
    id: pipeline.id,
    status: mapPipelineStatus(pipeline.status),
    dur: formatDur(pipeline.duration),
    age: formatAge(pipeline.created_at, now),
    author: pipeline.user?.username ?? "",
    commit: mapCommit(pipeline.sha),
    title: mapTitle(commit),
    stages: mapStages(jobs),
  }
}

export function mapMergeRequest(
  repoName: string,
  mr: GitLabMergeRequest,
  approvals: GitLabMergeRequestApprovals,
  now: number = Date.now()
): MergeRequest {
  const base: MergeRequest = {
    repo: repoName,
    id: mr.iid,
    title: mr.title,
    author: mr.author.username,
    from: mr.source_branch,
    to: mr.target_branch,
    reviewers: mapMrReviewers(mr.reviewers),
    ci: mapMrCi(mr.head_pipeline, mr.iid),
    days: mapMrDays(mr.created_at, now),
    approvals: mapApprovals(approvals.approvals_required, approvals.approvals_left),
  }
  if (mr.has_conflicts === true) {
    base.conflicts = true
  }
  return base
}
