"use client"

import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"
import { TimelineRow } from "./shared/timeline-row"
import { MrTimeline } from "./shared/mr-timeline"

export function V5Timeline() {
  const dataset = useDataset()
  return (
    <section data-testid="variation-v5" aria-labelledby="h-v5">
      <div className="section-h">
        <h2 id="h-v5">{copy.variations.v5.heading}</h2>
        <span className="count">
          últimas 24h · una fila por repo, apilado por rama
        </span>
      </div>
      <div
        className="rough"
        style={{ background: "var(--bg-2)", padding: "12px 14px" }}
      >
        {dataset.repos.map((r, i) => (
          <TimelineRow key={r.name} repo={r} seed={i} />
        ))}
      </div>

      <div className="section-h" style={{ marginTop: 24 }}>
        <h3>MRs pendientes · vida de la MR</h3>
        <span className="count">{dataset.mrs.length}</span>
      </div>
      <MrTimeline mrs={dataset.mrs} />
    </section>
  )
}
