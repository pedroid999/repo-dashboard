import type { ReactNode, ButtonHTMLAttributes } from "react"

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  icon: ReactNode
  label: string
}

export function IconButton({ icon, label, className, ...rest }: IconButtonProps) {
  const classes = ["iconbtn", "rough-sm"]
  if (className) classes.push(className)
  return (
    <button type="button" className={classes.join(" ")} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  )
}
