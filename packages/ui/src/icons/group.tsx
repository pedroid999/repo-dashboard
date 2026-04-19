import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const GroupIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="5.5" cy="6" r="2" />
    <circle cx="10.5" cy="6" r="2" />
    <path d="M2 13c0-2 1.5-3 3.5-3s3.5 1 3.5 3M8 13c0-2 1-3 2.5-3S14 11 14 13" />
    {children}
  </svg>
)
