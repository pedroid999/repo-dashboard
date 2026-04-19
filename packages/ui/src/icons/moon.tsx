import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const MoonIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M13 9.5A5 5 0 116.5 3 5 5 0 0013 9.5z" />
    {children}
  </svg>
)
