import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const ProjectIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M3 4h10v9H3z" />
    <path d="M3 7h10M6 4v9" />
    {children}
  </svg>
)
