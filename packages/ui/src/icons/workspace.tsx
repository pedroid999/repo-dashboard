import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const WorkspaceIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <rect x="2" y="3" width="12" height="10" rx="1.5" />
    <path d="M2 6h12M5 3v10" />
    {children}
  </svg>
)
