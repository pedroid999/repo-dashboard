import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

export const XIcon: React.FC<IconProps> = ({ title, children, ...props }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M4 4l8 8M12 4l-8 8" />
    {children}
  </svg>
)
