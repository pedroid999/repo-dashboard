import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const SubgroupIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M2 4h5l1.5 1.5H14V13H2z" />
    <path d="M5 8h6M5 10.5h4" />
    {children}
  </svg>
)
