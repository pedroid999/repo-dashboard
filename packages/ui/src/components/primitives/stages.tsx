export type StageState = "ok" | "fail" | "run" | "skip"

export interface StagesProps {
  stages: StageState[]
}

export function Stages({ stages }: StagesProps) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {stages.map((stage, idx) => (
        <span key={idx} className={`sdot ${stage}`} title={stage} />
      ))}
    </span>
  )
}
