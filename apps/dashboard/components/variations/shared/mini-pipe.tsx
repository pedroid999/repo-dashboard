"use client"

import type { Pipeline } from "@workspace/domain"
import { Avatar, Chip, Stages } from "@workspace/ui"
import { BranchIcon, ClockIcon } from "@workspace/ui/icons"

export interface MiniPipeProps {
  pipeline: Pipeline & { repo: string }
}

export function MiniPipe({ pipeline: p }: MiniPipeProps) {
  return (
    <div
      className="rough-sm"
      data-testid="mini-pipe"
      style={{ padding: "8px 10px", background: "var(--bg-3)" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
      >
        <span style={{ fontWeight: 700 }}>{p.repo}</span>
        <span
          className="mono"
          style={{ color: "var(--link)", fontSize: 11 }}
        >
          #{p.id}
        </span>
        <span style={{ marginLeft: "auto" }}>
          <Avatar name={p.author} />
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          margin: "4px 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {p.title}
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Chip icon={<BranchIcon />}>{p.branch}</Chip>
        <Chip icon={<ClockIcon />}>{p.dur}</Chip>
        <Stages stages={p.stages} />
      </div>
    </div>
  )
}
