import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const DlIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M8 3v7M4.5 7.5L8 11l3.5-3.5M3 13h10" />
    {children}
  </svg>
)
