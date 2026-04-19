import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const PRIMITIVES_DIR = join(__dirname)

function collectSources(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...collectSources(join(dir, entry.name)))
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) {
      out.push(join(dir, entry.name))
    }
  }
  return out
}

describe("@workspace/ui primitives — static import boundaries (UIC-5)", () => {
  it("no primitive imports from @workspace/domain", () => {
    const files = collectSources(PRIMITIVES_DIR)
    expect(files.length).toBeGreaterThan(0)
    const violations: string[] = []
    for (const file of files) {
      const src = readFileSync(file, "utf8")
      if (/from\s+["']@workspace\/domain/.test(src)) {
        violations.push(file)
      }
    }
    expect(violations).toEqual([])
  })
})
