"use client"

import type { Repo } from "@workspace/domain"
import { Chip, Squiggle, Pill } from "@workspace/ui"
import { PipelineRow } from "./pipeline-row"

export interface RepoCardProps {
  repo: Repo
  mrCount?: number
  pipelineLimit?: number
}

export function RepoCard({ repo, mrCount = 0, pipelineLimit = 5 }: RepoCardProps) {
  const displayed = repo.pipelines.slice(0, pipelineLimit)
  const failed = repo.pipelines.filter((p) => p.status === "failed").length
  const running = repo.pipelines.filter((p) => p.status === "running").length
  return (
    <div className="card rough" data-testid="repo-card">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span title={repo.name} style={{ fontWeight: 700, fontSize: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{repo.name}</span>
        <Chip>{repo.owner}</Chip>
        <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {failed > 0 ? <Pill className="fail">{failed} fail</Pill> : null}
          {running > 0 ? <Pill className="run">{running} run</Pill> : null}
          {mrCount > 0 ? <Pill className="link">{mrCount} MR</Pill> : null}
        </span>
      </div>
      <Squiggle />
      <div style={{ display: "grid", gap: 8, marginTop: 4 }}>
        {displayed.map((p) => (
          <PipelineRow key={p.id} pipeline={p} />
        ))}
      </div>
    </div>
  )
}
