"use client"

import type { MergeRequest } from "@workspace/domain"
import { Avatar, StatusPill } from "@workspace/ui"

export interface MrCompactProps {
  mrs: MergeRequest[]
}

export function MrCompact({ mrs }: MrCompactProps) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {mrs.map((m) => (
        <div
          key={`${m.repo}-${m.id}`}
          className="row rough-sm"
          data-testid="mr-compact-row"
          style={{
            background: "var(--bg-2)",
            display: "grid",
            gridTemplateColumns: "1fr 2fr auto auto auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 12, color: "var(--link)" }}
          >
            {m.repo}!{m.id}
          </span>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {m.title}
          </span>
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-2)" }}
          >
            {m.from} → {m.to}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Avatar name={m.author} />
            {m.reviewers.slice(0, 2).map((r) => (
              <Avatar key={r} name={r} />
            ))}
          </span>
          <span>
            <StatusPill
              status={
                m.ci === "ok"
                  ? "passed"
                  : m.ci === "fail"
                  ? "failed"
                  : "running"
              }
            />
          </span>
        </div>
      ))}
    </div>
  )
}
