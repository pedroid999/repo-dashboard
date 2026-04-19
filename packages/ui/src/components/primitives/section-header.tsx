import type { ReactNode } from "react"

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export interface SectionHeaderProps {
  children: ReactNode
  as?: HeadingLevel
  actions?: ReactNode
  className?: string
}

export function SectionHeader({
  children,
  as: Heading = "h2",
  actions,
  className,
}: SectionHeaderProps) {
  const classes = ["section-header", "section-h"]
  if (className) classes.push(className)
  return (
    <div className={classes.join(" ")}>
      <Heading>{children}</Heading>
      {actions ? (
        <div className="section-header__actions" style={{ marginLeft: "auto" }}>
          {actions}
        </div>
      ) : null}
    </div>
  )
}
