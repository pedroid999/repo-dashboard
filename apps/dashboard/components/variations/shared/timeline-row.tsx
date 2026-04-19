"use client"

import type { Repo } from "@workspace/domain"
import { Chip } from "@workspace/ui"
import { BranchIcon } from "@workspace/ui/icons"

export interface TimelineRowProps {
  repo: Repo
  seed: number
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function TimelineRow({ repo, seed }: TimelineRowProps) {
  const rnd = seededRandom(seed * 11 + 3)
  const branches = Array.from(
    new Set(
      repo.pipelines.map((p) => p.branch.split("/")[0] ?? p.branch)
    )
  )
  return (
    <div
      data-testid="timeline-row"
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: 10,
        alignItems: "center",
        padding: "6px 0",
        borderTop: "1.5px dashed var(--line-2)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <b style={{ fontSize: 14 }}>{repo.name}</b>
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)" }}
        >
          {repo.owner}
        </span>
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        {branches.map((b) => {
          const count = 3 + Math.floor(rnd() * 5)
          const segs = []
          for (let i = 0; i < count; i++) {
            const start = rnd() * 95
            const width = 1 + rnd() * 4
            const roll = rnd()
            const cls = roll < 0.15 ? "fail" : roll < 0.22 ? "run" : "ok"
            segs.push({ start, width, cls, marker: false })
          }
          const latest = repo.pipelines.find((p) => p.branch.startsWith(b))
          if (latest) {
            segs.push({
              start: 96,
              width: 3.5,
              cls:
                latest.status === "passed"
                  ? "ok"
                  : latest.status === "failed"
                  ? "fail"
                  : "run",
              marker: true,
            })
          }
          return (
            <div
              key={b}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Chip icon={<BranchIcon />}>{b}</Chip>
              <div
                className="bar"
                data-testid="timeline-bar"
                style={{
                  height: 14,
                  background: "var(--bg-3)",
                  position: "relative",
                  borderRadius: 3,
                }}
              >
                {segs.map((s, i) => (
                  <div
                    key={i}
                    className="seg"
                    style={{
                      position: "absolute",
                      left: `${s.start}%`,
                      width: `${s.width}%`,
                      height: "100%",
                      background:
                        s.cls === "ok"
                          ? "var(--ok)"
                          : s.cls === "fail"
                          ? "var(--fail)"
                          : "var(--run)",
                      opacity: s.marker ? 1 : 0.7,
                      boxShadow: s.marker ? "0 0 0 2px var(--bg-2)" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
