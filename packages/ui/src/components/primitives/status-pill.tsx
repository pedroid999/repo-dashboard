import type { ReactNode } from "react"
import { CheckIcon } from "@workspace/ui/icons/check"
import { XIcon } from "@workspace/ui/icons/x"
import { PlayIcon } from "@workspace/ui/icons/play"

export type PipelineStatus = "passed" | "failed" | "running"

interface StatusMeta {
  cls: "ok" | "fail" | "run"
  label: string
  icon: ReactNode
}

const STATUS_META: Record<PipelineStatus, StatusMeta> = {
  passed: { cls: "ok", label: "Passed", icon: <CheckIcon /> },
  failed: { cls: "fail", label: "Failed", icon: <XIcon /> },
  running: { cls: "run", label: "Running", icon: <PlayIcon /> },
}

export interface StatusPillProps {
  status: PipelineStatus
  small?: boolean
  className?: string
}

export function StatusPill({ status, small, className }: StatusPillProps) {
  const meta = STATUS_META[status]
  const classes = ["pill", meta.cls]
  if (small) classes.push("pill--small")
  if (className) classes.push(className)
  return (
    <span className={classes.join(" ")} aria-label={meta.label.toLowerCase()}>
      <span
        aria-hidden="true"
        style={{ width: 12, height: 12, display: "inline-grid", placeItems: "center" }}
      >
        {meta.icon}
      </span>
      {meta.label}
    </span>
  )
}
