"use client"

import {
  PipeIcon,
  MrIcon,
  BranchIcon,
  ClockIcon,
} from "@workspace/ui/icons"
import { copy } from "../../lib/copy"

const viewIconMap = {
  pipelines: PipeIcon,
  mrs: MrIcon,
  branches: BranchIcon,
  activity: ClockIcon,
} as const

export function Sidebar() {
  const activeProject = "platform-core"
  const activeView = "pipelines"
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo" aria-hidden="true">
          {copy.brand.logo}
        </span>
        <span>{copy.brand.name}</span>
      </div>

      <h3 className="navlbl">{copy.sidebar.sections.project}</h3>
      <nav aria-label={copy.sidebar.sections.project}>
        {copy.sidebar.projects.map((p) => {
          const isActive = p.slug === activeProject
          return (
            <div
              key={p.slug}
              className={`navi${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="sq" aria-hidden="true" />
              <span>{p.slug}</span>
              <span className="badge mono">{p.count}</span>
            </div>
          )
        })}
      </nav>

      <h3 className="navlbl">{copy.sidebar.sections.view}</h3>
      <nav aria-label={copy.sidebar.sections.view}>
        {copy.sidebar.views.map((v) => {
          const Icon = viewIconMap[v.slug as keyof typeof viewIconMap]
          const isActive = v.slug === activeView
          return (
            <div
              key={v.slug}
              className={`navi${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon />
              <span>{v.label}</span>
              {"count" in v && v.count ? (
                <span className="badge mono">{v.count}</span>
              ) : null}
            </div>
          )
        })}
      </nav>

      <h3 className="navlbl">{copy.sidebar.sections.team}</h3>
      <nav aria-label={copy.sidebar.sections.team}>
        {copy.sidebar.teams.map((t) => (
          <div key={t} className="navi">
            <span className="sq" aria-hidden="true" />
            <span>{t}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
