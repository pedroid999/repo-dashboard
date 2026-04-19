/**
 * Server-only boundary guard (GL-1, design decision #2).
 *
 * Every GitLab adapter file that touches `fetch`, env or logging MUST start
 * with `import "server-only"`. Pure modules (`mappers.ts`, `types.ts`) are
 * intentionally testable cross-env and are excluded.
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const HERE = dirname(fileURLToPath(import.meta.url))

const SERVER_ONLY_FILES = ["client.ts", "log.ts"]
const PURE_FILES = ["mappers.ts", "types.ts"]

describe("gitlab adapter — server-only boundary (GL-1)", () => {
  for (const relative of SERVER_ONLY_FILES) {
    it(`${relative} starts with import "server-only"`, () => {
      const source = readFileSync(join(HERE, relative), "utf8")
      expect(source).toMatch(/^import "server-only"/)
    })
  }

  for (const relative of PURE_FILES) {
    it(`${relative} is pure (no server-only import)`, () => {
      const source = readFileSync(join(HERE, relative), "utf8")
      expect(source).not.toMatch(/import "server-only"/)
    })
  }
})
