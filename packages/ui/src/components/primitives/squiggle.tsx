export function Squiggle() {
  return (
    <svg
      className="squiggle"
      viewBox="0 0 200 6"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M0 3 Q 10 0, 20 3 T 40 3 T 60 3 T 80 3 T 100 3 T 120 3 T 140 3 T 160 3 T 180 3 T 200 3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      />
    </svg>
  )
}
