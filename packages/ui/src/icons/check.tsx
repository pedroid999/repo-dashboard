import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const CheckIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M3 8.5l3.2 3L13 5" />
    {children}
  </svg>
)
