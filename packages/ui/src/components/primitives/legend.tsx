import { StatusPill, type PipelineStatus } from "@workspace/ui/components/primitives/status-pill"

const LEGEND_ROWS: PipelineStatus[] = ["passed", "failed", "running"]

export interface LegendProps {
  className?: string
}

export function Legend({ className }: LegendProps) {
  const classes = ["legend"]
  if (className) classes.push(className)
  return (
    <ul className={classes.join(" ")} role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {LEGEND_ROWS.map((status) => (
        <li key={status} role="listitem">
          <StatusPill status={status} small />
        </li>
      ))}
    </ul>
  )
}
