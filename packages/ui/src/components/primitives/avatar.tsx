export interface AvatarProps {
  name: string
  className?: string
}

export function Avatar({ name, className }: AvatarProps) {
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  const initials = tokens
    .map((token) => token.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const classes = ["av"]
  if (className) classes.push(className)
  return (
    <span
      className={classes.join(" ")}
      role="img"
      aria-label={name}
      title={name}
    >
      {initials}
    </span>
  )
}
