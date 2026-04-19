import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const PlayIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="8" cy="8" r="6" />
    <path d="M7 6l3 2-3 2z" fill="currentColor" />
    {children}
  </svg>
)
