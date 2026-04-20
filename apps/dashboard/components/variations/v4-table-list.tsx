"use client"

import { useDataset } from "../../lib/dataset-context"
import { listPipelines } from "@workspace/domain"
import { StatusPill, Stages, Chip, Avatar } from "@workspace/ui"
import {
  BranchIcon,
  CommitIcon,
  ClockIcon,
  CalIcon,
  DlIcon,
} from "@workspace/ui/icons"
import { copy } from "../../lib/copy"

const STATUS_RANK = {
  failed: 0,
  running: 1,
  passed: 2,
} as const

export function V4TableList() {
  const dataset = useDataset()
  const rows = listPipelines(dataset)
    .slice()
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])
  const cols = "140px 1.4fr 1fr 130px 100px 140px 100px"
  return (
    <section data-testid="variation-v4" aria-labelledby="h-v4">
      <div className="section-h">
        <h2 id="h-v4">{copy.variations.v4.heading}</h2>
        <span className="count">
          {rows.length} pipelines · ordenadas por estado
        </span>
      </div>
      <div
        className="rough"
        style={{ background: "var(--bg-2)", overflow: "hidden" }}
      >
        <div className="th" style={{ gridTemplateColumns: cols }}>
          <span>Status</span>
          <span>Repo / Pipeline</span>
          <span>Rama / commit</span>
          <span>Autor</span>
          <span>Duración</span>
          <span>Stages</span>
          <span>Actions</span>
        </div>
        {rows.map((p) => (
          <div
            key={`${p.repo}-${p.id}`}
            className="tbl-row"
            data-testid="pipeline-table-row"
            style={{ gridTemplateColumns: cols }}
          >
            <span
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <StatusPill status={p.status} />
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--ink-3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ClockIcon /> {p.dur}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--ink-3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <CalIcon /> {p.age}
              </span>
            </span>
            <span>
              <div
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <b>{p.repo}</b>
                <span
                  className="mono"
                  style={{ color: "var(--link)", fontSize: 12 }}
                >
                  #{p.id}
                </span>
              </div>
              <div
                className="muted"
                title={p.title}
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.title}
              </div>
            </span>
            <span
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <Chip icon={<BranchIcon />}>{p.branch}</Chip>
              <Chip icon={<CommitIcon />}>{p.commit}</Chip>
            </span>
            <span
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Avatar name={p.author} />
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-2)" }}
              >
                {p.author}
              </span>
            </span>
            <span className="mono" style={{ fontSize: 12 }}>
              {p.dur}
            </span>
            <span>
              <Stages stages={p.stages} />
            </span>
            <span>
              <div
                className="iconbtn rough-sm"
                aria-hidden="true"
                style={{ width: 30, height: 28 }}
              >
                <DlIcon />
              </div>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
