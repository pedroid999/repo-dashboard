"use client"

import { useDataset } from "../../lib/dataset-context"
import { copy } from "../../lib/copy"

export function V2Heatmap() {
  const dataset = useDataset()
  const cellCls = (status: string) =>
    status === "passed"
      ? "ok"
      : status === "failed"
      ? "fail"
      : status === "running"
      ? "run"
      : "skip"
  return (
    <section data-testid="variation-v2" aria-labelledby="h-v2">
      <div className="section-h">
        <h2 id="h-v2">{copy.variations.v2.heading}</h2>
        <span className="count">
          últimas pipelines por repo · hover para detalle
        </span>
      </div>

      <div className="hm" data-testid="heatmap-grid">
        {dataset.repos.map((r) => (
          <div
            key={r.name}
            data-testid="heatmap-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 0",
            }}
          >
            <span
              className="label"
              style={{ minWidth: 160, fontSize: 13 }}
            >
              {r.name}
            </span>
            <div
              style={{ display: "flex", gap: 3 }}
              data-testid="heatmap-row-cells"
            >
              {r.pipelines.map((p) => (
                <span
                  key={p.id}
                  data-testid="heatmap-cell"
                  className={`cell ${cellCls(p.status)}`}
                  title={`${p.branch} · ${p.status}`}
                  style={{
                    width: 16,
                    height: 16,
                    background:
                      p.status === "passed"
                        ? "var(--ok)"
                        : p.status === "failed"
                        ? "var(--fail)"
                        : "var(--run)",
                    borderRadius: 3,
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
