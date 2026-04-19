"use client"

import type { MergeRequest } from "@workspace/domain"
import { Avatar, StatusPill } from "@workspace/ui"

export interface MiniMrProps {
  mr: MergeRequest
}

export function MiniMr({ mr: m }: MiniMrProps) {
  return (
    <div
      className="rough-sm"
      data-testid="mini-mr"
      style={{ padding: "8px 10px", background: "var(--bg-3)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          className="mono"
          style={{ color: "var(--link)", fontSize: 11 }}
        >
          {m.repo}!{m.id}
        </span>
        {m.conflicts ? (
          <span className="pill fail" style={{ marginLeft: "auto" }}>
            conflict
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 13, margin: "4px 0" }}>{m.title}</div>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Avatar name={m.author} />
        <span
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-2)" }}
        >
          {m.from} → {m.to}
        </span>
        <span style={{ marginLeft: "auto" }}>
          <StatusPill
            status={
              m.ci === "ok" ? "passed" : m.ci === "fail" ? "failed" : "running"
            }
          />
        </span>
      </div>
    </div>
  )
}
