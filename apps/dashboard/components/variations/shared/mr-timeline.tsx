"use client"

import type { MergeRequest } from "@workspace/domain"
import { Avatar, StatusPill } from "@workspace/ui"
import { STALE_DAYS_THRESHOLD } from "@workspace/domain"

export interface MrTimelineProps {
  mrs: MergeRequest[]
}

export function MrTimeline({ mrs }: MrTimelineProps) {
  return (
    <div
      className="rough"
      data-testid="mr-timeline"
      style={{ background: "var(--bg-2)", padding: "10px 14px" }}
    >
      {mrs.map((m) => {
        const days = m.days ?? 0
        const pct = Math.min(100, (days / 7) * 100)
        const old = days > STALE_DAYS_THRESHOLD
        const ciColor =
          m.ci === "fail"
            ? "var(--fail)"
            : m.ci === "run"
            ? "var(--run)"
            : "var(--link)"
        return (
          <div
            key={`${m.repo}-${m.id}`}
            data-testid="mr-timeline-row"
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 80px",
              gap: 12,
              alignItems: "center",
              padding: "8px 0",
              borderTop: "1.5px dashed var(--line-2)",
            }}
          >
            <div>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--link)" }}
              >
                {m.repo}!{m.id}
              </div>
              <div
                style={{
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.title}
              </div>
            </div>
            <div style={{ position: "relative", height: 20 }}>
              <div
                style={{
                  position: "absolute",
                  inset: "8px 0",
                  background: "var(--bg-3)",
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: `${pct}%`,
                  height: 12,
                  background: old ? "var(--fail)" : ciColor,
                  borderRadius: 3,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${pct}%`,
                  top: 0,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transform: "translateX(4px)",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--ink-2)",
                }}
              >
                <Avatar name={m.author} />
                <StatusPill
                  status={
                    m.ci === "ok"
                      ? "passed"
                      : m.ci === "fail"
                      ? "failed"
                      : "running"
                  }
                />
              </div>
            </div>
            <span
              className="mono"
              style={{
                fontSize: 12,
                color: old ? "var(--fail)" : "var(--ink-2)",
                textAlign: "right",
              }}
            >
              {days}d abierta
            </span>
          </div>
        )
      })}
    </div>
  )
}
