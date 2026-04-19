"use client"

import type { MergeRequest } from "@workspace/domain"
import { Avatar, StatusPill, Pill } from "@workspace/ui"

export interface MrListProps {
  mrs: MergeRequest[]
}

export function MrList({ mrs }: MrListProps) {
  const cols = "1.3fr 2fr 1fr 1.2fr 0.8fr 0.6fr 0.6fr"
  return (
    <div className="rough" style={{ background: "var(--bg-2)" }}>
      <div className="th" style={{ gridTemplateColumns: cols }}>
        <span>Repo / MR</span>
        <span>Título</span>
        <span>Autor</span>
        <span>Rama → destino</span>
        <span>Reviewers</span>
        <span>CI</span>
        <span>Aprob.</span>
      </div>
      {mrs.map((m) => (
        <div
          key={`${m.repo}-${m.id}`}
          className="tbl-row"
          data-testid="mr-row"
          style={{ gridTemplateColumns: cols }}
        >
          <span>
            <span className="mono" style={{ color: "var(--link)" }}>
              {m.repo}!{m.id}
            </span>
            {m.conflicts ? (
              <span className="pill fail" data-testid="mr-conflict">
                conflict
              </span>
            ) : null}
            {m.stale ? (
              <Pill className="neutral">{m.days}d</Pill>
            ) : null}
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
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Avatar name={m.author} />
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-2)" }}
            >
              {m.author}
            </span>
          </span>
          <span className="mono" style={{ fontSize: 11 }}>
            <span style={{ color: "var(--purple)" }}>{m.from}</span>{" "}
            <span style={{ color: "var(--ink-3)" }}>→</span>{" "}
            <span style={{ color: "var(--ok)" }}>{m.to}</span>
          </span>
          <span style={{ display: "flex", gap: 2 }}>
            {m.reviewers.map((r) => (
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
          <span className="mono" style={{ fontSize: 12 }}>
            {m.approvals}
          </span>
        </div>
      ))}
    </div>
  )
}
