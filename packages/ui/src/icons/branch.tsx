import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const BranchIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="4" cy="3" r="1.6" />
    <circle cx="4" cy="13" r="1.6" />
    <circle cx="12" cy="6" r="1.6" />
    <path d="M4 4.6v6.8M4 11c0-4 8-2 8-3.4" />
    {children}
  </svg>
)
