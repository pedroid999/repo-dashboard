"use client"

import type { ReactNode } from "react"

export interface KanbanColumnProps {
  title: string
  color: "ok" | "fail" | "run" | "link"
  count: number
  children: ReactNode
}

export function KanbanColumn({
  title,
  color,
  count,
  children,
}: KanbanColumnProps) {
  return (
    <div className="col rough" data-testid="kanban-column" data-color={color}>
      <h4>
        <span className={`sdot ${color}`} aria-hidden="true" /> {title}{" "}
        <span
          className="count mono"
          style={{ marginLeft: "auto", color: "var(--ink-3)" }}
          data-testid="kanban-count"
        >
          {count}
        </span>
      </h4>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </div>
  )
}
