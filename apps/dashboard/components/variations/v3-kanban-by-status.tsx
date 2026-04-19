"use client"

import { useDataset } from "../../lib/dataset-context"
import { listPipelines, countByStatus } from "@workspace/domain"
import { copy } from "../../lib/copy"
import { KanbanColumn } from "./shared/kanban-column"
import { MiniPipe } from "./shared/mini-pipe"

export function V3KanbanByStatus() {
  const dataset = useDataset()
  const pipelines = listPipelines(dataset)
  const counts = countByStatus(pipelines)
  const failed = pipelines.filter((p) => p.status === "failed")
  const running = pipelines.filter((p) => p.status === "running")
  const passed = pipelines.filter((p) => p.status === "passed")
  return (
    <section data-testid="variation-v3" aria-labelledby="h-v3">
      <div className="section-h">
        <h2 id="h-v3">{copy.variations.v3.heading}</h2>
        <span className="count">
          arrastra mentalmente · agrupado por estado en vez de repo
        </span>
      </div>
      <div
        className="kan"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        <KanbanColumn title="Failed" color="fail" count={counts.failed}>
          {failed.map((p) => (
            <MiniPipe key={`${p.repo}-${p.id}`} pipeline={p} />
          ))}
        </KanbanColumn>
        <KanbanColumn title="Running" color="run" count={counts.running}>
          {running.map((p) => (
            <MiniPipe key={`${p.repo}-${p.id}`} pipeline={p} />
          ))}
        </KanbanColumn>
        <KanbanColumn
          title="Passed (last)"
          color="ok"
          count={counts.passed}
        >
          {passed.slice(0, 8).map((p) => (
            <MiniPipe key={`${p.repo}-${p.id}`} pipeline={p} />
          ))}
          {passed.length > 8 ? (
            <div
              className="faint mono"
              style={{ fontSize: 11, padding: "4px 8px" }}
            >
              + {passed.length - 8} más
            </div>
          ) : null}
        </KanbanColumn>
      </div>
    </section>
  )
}
