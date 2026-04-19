export const VARIATIONS = ["v1", "v2", "v3", "v4", "v5"] as const

export type Variation = (typeof VARIATIONS)[number]

const VARIATION_SET: ReadonlySet<string> = new Set(VARIATIONS)

export function parseVariation(raw?: string): Variation {
  if (raw && VARIATION_SET.has(raw)) {
    return raw as Variation
  }
  return "v1"
}
