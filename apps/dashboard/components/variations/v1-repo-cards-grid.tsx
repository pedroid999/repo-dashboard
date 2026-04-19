"use client"

import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"
import { RepoCard } from "./shared/repo-card"

export function V1RepoCardsGrid() {
  const dataset = useDataset()
  return (
    <section data-testid="variation-v1" aria-labelledby="h-v1">
      <div className="section-h">
        <h2 id="h-v1">{copy.variations.v1.heading}</h2>
        <span className="count">
          {dataset.repos.length} repos · última por rama principal
        </span>
      </div>
      <div className="gridR">
        {dataset.repos.map((r) => {
          const relatedMrs = dataset.mrs.filter((m) => m.repo === r.name)
          return <RepoCard key={r.name} repo={r} mrCount={relatedMrs.length} />
        })}
      </div>
    </section>
  )
}
