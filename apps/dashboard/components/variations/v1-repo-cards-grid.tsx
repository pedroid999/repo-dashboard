"use client"

import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"
import { RepoCard } from "./shared/repo-card"

export function V1RepoCardsGrid() {
  const dataset = useDataset()
  const repos = dataset.repos.filter((r) => r.pipelines.length > 0)
  return (
    <section data-testid="variation-v1" aria-labelledby="h-v1">
      <div className="section-h">
        <h2 id="h-v1">{copy.variations.v1.heading}</h2>
        <span className="count">
          {repos.length} repos · última por rama principal
        </span>
        <div className="legend" style={{ marginLeft: "auto" }}>
          <span><span className="sdot ok" aria-hidden="true" /> passed</span>
          <span><span className="sdot run" aria-hidden="true" /> running</span>
          <span><span className="sdot fail" aria-hidden="true" /> failed</span>
        </div>
      </div>
      <div className="gridR">
        {repos.map((r) => {
          const relatedMrs = dataset.mrs.filter((m) => m.repo === r.name)
          return <RepoCard key={r.name} repo={r} mrCount={relatedMrs.length} />
        })}
      </div>
    </section>
  )
}
