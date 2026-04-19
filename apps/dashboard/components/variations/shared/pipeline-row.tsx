"use client"

import type { Pipeline } from "@workspace/domain"
import {
  StatusPill,
  Stages,
  Chip,
  Avatar,
} from "@workspace/ui"
import {
  BranchIcon,
  CommitIcon,
  ClockIcon,
  CalIcon,
} from "@workspace/ui/icons"

export interface PipelineRowProps {
  pipeline: Pipeline
}

export function PipelineRow({ pipeline: p }: PipelineRowProps) {
  return (
    <div
      className="row rough-sm"
      data-testid="pipeline-row"
      style={{ background: "var(--bg-3)" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
      >
        <StatusPill status={p.status} />
        <Chip icon={<BranchIcon />}>{p.branch}</Chip>
        <span className="mono" style={{ color: "var(--link)" }}>
          #{p.id}
        </span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 14,
          }}
        >
          {p.title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 6,
          flexWrap: "wrap",
        }}
      >
        <Chip icon={<CommitIcon />}>{p.commit}</Chip>
        <Chip icon={<ClockIcon />}>{p.dur}</Chip>
        <Chip icon={<CalIcon />}>{p.age}</Chip>
        <Stages stages={p.stages} />
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Avatar name={p.author} />
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-3)" }}
          >
            {p.author}
          </span>
        </span>
      </div>
    </div>
  )
}
