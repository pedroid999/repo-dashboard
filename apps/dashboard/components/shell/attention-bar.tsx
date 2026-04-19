"use client"

import {
  countByStatus,
  listBlockedMrs,
  listPipelines,
  listStaleMrs,
} from "@workspace/domain"
import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"

export function AttentionBar() {
  const dataset = useDataset()
  const pipelines = listPipelines(dataset)
  const counts = countByStatus(pipelines)
  const blockedMrs = listBlockedMrs(dataset.mrs).length
  const staleMrs = listStaleMrs(dataset.mrs).length

  const items: Array<{ count: number; label: string; cls: string }> = [
    { count: counts.failed, label: copy.attention.pipelinesRed, cls: "fail" },
    { count: counts.running, label: copy.attention.running, cls: "run" },
    { count: blockedMrs, label: copy.attention.blockedMrs, cls: "link" },
    { count: staleMrs, label: copy.attention.staleMrs, cls: "neutral" },
  ]

  return (
    <section
      className="notebox rough"
      role="region"
      aria-label={copy.attention.heading}
      style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}
    >
      <b style={{ fontSize: 15 }}>{copy.attention.heading}</b>
      {items.map((item) => (
        <span key={item.label}>
          <span className={`pill ${item.cls}`} data-testid="attention-count">
            {item.count}
          </span>{" "}
          {item.label}
        </span>
      ))}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--ink-3)",
        }}
      >
        {copy.attention.updatedSuffix}
      </span>
    </section>
  )
}
