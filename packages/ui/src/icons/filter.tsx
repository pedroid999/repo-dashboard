import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const FilterIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M2 3h12l-4.5 6v4l-3 1V9z" />
    {children}
  </svg>
)
