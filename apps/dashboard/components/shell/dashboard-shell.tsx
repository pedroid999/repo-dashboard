"use client"

import { type ReactNode } from "react"
import type { Dataset } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import type { Variation } from "../../lib/variation"
import { copy } from "../../lib/copy"

export interface DashboardShellProps {
  dataset: Dataset
  initialVariation: Variation
  children?: ReactNode
}

export function DashboardShell({
  dataset,
  initialVariation,
  children,
}: DashboardShellProps) {
  return (
    <DatasetProvider dataset={dataset}>
      <main data-testid="dashboard-shell" data-variation={initialVariation}>
        <h1 className="sr-only">{copy.variations[initialVariation].heading}</h1>
        {children}
      </main>
    </DatasetProvider>
  )
}
