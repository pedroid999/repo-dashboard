import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const RefreshIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M13.5 3.5v3h-3M2.5 12.5v-3h3" />
    <path d="M12.5 6.5A5 5 0 003.5 7M3.5 9.5A5 5 0 0012.5 9" />
    {children}
  </svg>
)
