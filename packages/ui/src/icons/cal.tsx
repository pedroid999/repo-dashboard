import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const CalIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <rect x="2" y="3.5" width="12" height="10" rx="1.5" />
    <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
    {children}
  </svg>
)
