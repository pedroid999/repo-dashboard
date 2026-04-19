import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const MrIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="4" cy="4" r="1.6" />
    <circle cx="4" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <path d="M4 5.6v4.8M4 8c4 0 8 0 8 4" />
    {children}
  </svg>
)
