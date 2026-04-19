import type { ReactNode } from "react"

export type ChipVariant = "default" | "muted" | "link" | "purple"

export interface ChipProps {
  children: ReactNode
  icon?: ReactNode
  variant?: ChipVariant
  title?: string
  className?: string
}

export function Chip({ children, icon, variant = "default", title, className }: ChipProps) {
  const classes = ["chip", `chip-${variant}`]
  if (className) classes.push(className)
  return (
    <span className={classes.join(" ")} title={title}>
      {icon}
      {children}
    </span>
  )
}
