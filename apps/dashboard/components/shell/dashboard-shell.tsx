"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { Dataset } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { VARIATIONS, type Variation } from "../../lib/variation"
import { copy } from "../../lib/copy"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { AttentionBar } from "./attention-bar"
import { TweaksPanel } from "./tweaks-panel"
import { V1RepoCardsGrid } from "../variations/v1-repo-cards-grid"
import { V2Heatmap } from "../variations/v2-heatmap"
import { V3KanbanByStatus } from "../variations/v3-kanban-by-status"
import { V4TableList } from "../variations/v4-table-list"
import { V5Timeline } from "../variations/v5-timeline"

const VARIATION_COMPONENTS: Record<Variation, () => React.ReactElement> = {
  v1: V1RepoCardsGrid,
  v2: V2Heatmap,
  v3: V3KanbanByStatus,
  v4: V4TableList,
  v5: V5Timeline,
}

export interface DashboardShellProps {
  dataset: Dataset
  initialVariation: Variation
}

export function DashboardShell({ dataset, initialVariation }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [variation, setVariation] = useState<Variation>(initialVariation)
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)

  const sidebarProjects = useMemo(() => {
    const byOwner = new Map<string, number>()
    for (const repo of dataset.repos) {
      byOwner.set(repo.owner, (byOwner.get(repo.owner) ?? 0) + 1)
    }
    return Array.from(byOwner.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
  }, [dataset.repos])

  const filteredDataset = useMemo(() => {
    if (!selectedOwner) return dataset
    return {
      ...dataset,
      repos: dataset.repos.filter((r) => r.owner === selectedOwner),
      mrs: dataset.mrs.filter((mr) =>
        dataset.repos.find((r) => r.name === mr.repo && r.owner === selectedOwner)
      ),
    }
  }, [dataset, selectedOwner])

  const handleTabClick = (next: Variation) => {
    setVariation(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set("v", next)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DatasetProvider dataset={filteredDataset}>
      <div className="app">
        <Sidebar
          projects={sidebarProjects}
          selectedProject={selectedOwner}
          onSelectProject={setSelectedOwner}
        />
        <main className="main">
          <Topbar />

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

          <AttentionBar />

          {(() => {
            const VariationComponent = VARIATION_COMPONENTS[variation]
            return <VariationComponent />
          })()}

          <TweaksPanel />
        </main>
      </div>
    </DatasetProvider>
  )
}
