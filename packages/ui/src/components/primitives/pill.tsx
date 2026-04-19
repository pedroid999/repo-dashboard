import type { ReactNode } from "react"

export interface PillProps {
  children: ReactNode
  className?: string
}

export function Pill({ children, className }: PillProps) {
  const classes = ["pill"]
  if (className) classes.push(className)
  return <span className={classes.join(" ")}>{children}</span>
}
