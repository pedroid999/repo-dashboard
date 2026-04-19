import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const PipeIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <circle cx="3" cy="8" r="1.7" />
    <circle cx="8" cy="8" r="1.7" />
    <circle cx="13" cy="8" r="1.7" />
    <path d="M4.7 8h1.6M9.7 8h1.6" />
    {children}
  </svg>
)
