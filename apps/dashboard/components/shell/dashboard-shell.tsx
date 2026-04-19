"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { Dataset } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { VARIATIONS, type Variation } from "../../lib/variation"
import { copy } from "../../lib/copy"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { AttentionBar } from "./attention-bar"
import { TweaksPanel } from "./tweaks-panel"
import { VariationPlaceholder } from "../variations/placeholder"

export interface DashboardShellProps {
  dataset: Dataset
  initialVariation: Variation
}

export function DashboardShell({ dataset, initialVariation }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [variation, setVariation] = useState<Variation>(initialVariation)

  const handleTabClick = (next: Variation) => {
    setVariation(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set("v", next)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DatasetProvider dataset={dataset}>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar />

          <AttentionBar />

          <div
            className="tabs"
            role="tablist"
            aria-label="Variation switcher"
          >
            {VARIATIONS.map((v) => {
              const meta = copy.variations[v]
              const isActive = v === variation
              return (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tab${isActive ? " active" : ""}`}
                  onClick={() => handleTabClick(v)}
                >
                  {meta.label} <small>{meta.sub}</small>
                </button>
              )
            })}
          </div>

          <VariationPlaceholder id={variation} />

          <TweaksPanel />
        </main>
      </div>
    </DatasetProvider>
  )
}
