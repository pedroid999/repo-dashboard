export type LogEvent = {
  level: "warn"
  source: "gitlab"
  op: string
  [key: string]: unknown
}

export function warn(event: Omit<LogEvent, "level" | "source">): void {
  console.warn(JSON.stringify({ level: "warn", source: "gitlab", ...event }))
}
