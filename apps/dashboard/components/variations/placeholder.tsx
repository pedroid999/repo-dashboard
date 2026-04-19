"use client"

import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"
import type { Variation } from "../../lib/variation"

export interface VariationPlaceholderProps {
  id: Variation
}

export function VariationPlaceholder({ id }: VariationPlaceholderProps) {
  const dataset = useDataset()
  const headline = copy.variations[id].heading
  return (
    <section data-testid={`variation-${id}`} aria-labelledby={`h-${id}`}>
      <h2 id={`h-${id}`}>{headline}</h2>
      <p className="mono" style={{ color: "var(--ink-3)" }}>
        {dataset.repos.length} repos · {dataset.mrs.length} MRs
      </p>
    </section>
  )
}
