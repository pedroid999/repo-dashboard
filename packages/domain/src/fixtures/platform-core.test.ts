import { describe, it, expect } from "vitest"

import { Dataset } from "@workspace/domain/schemas/dataset"
import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"

describe("platformCoreFixture", () => {
  it("is a valid Dataset (eager parse at import time succeeded)", () => {
    expect(Dataset.safeParse(platformCoreFixture).success).toBe(true)
  })

  it("carries the 'platform-core' project identifier", () => {
    expect(platformCoreFixture.project).toBe("platform-core")
  })

  it("contains 12 repos and 10 merge requests (wireframe counts)", () => {
    expect(platformCoreFixture.repos).toHaveLength(12)
    expect(platformCoreFixture.mrs).toHaveLength(10)
  })

  it("every MR references a repo present in repos[]", () => {
    const repoNames = new Set(platformCoreFixture.repos.map((r) => r.name))
    const orphans = platformCoreFixture.mrs.filter((mr) => !repoNames.has(mr.repo))
    expect(orphans).toEqual([])
  })

  it("every pipeline stage is a valid Stage value", () => {
    const validStages = new Set(["ok", "fail", "run", "skip"])
    const bad: { repo: string; stage: string }[] = []
    for (const repo of platformCoreFixture.repos) {
      for (const pipeline of repo.pipelines) {
        for (const stage of pipeline.stages) {
          if (!validStages.has(stage)) bad.push({ repo: repo.name, stage })
        }
      }
    }
    expect(bad).toEqual([])
  })

  it("exposes variable-length stages (3, 4, and 5 observed in fixture)", () => {
    const lengths = new Set<number>()
    for (const repo of platformCoreFixture.repos) {
      for (const pipeline of repo.pipelines) {
        lengths.add(pipeline.stages.length)
      }
    }
    expect(lengths.has(3)).toBe(true)
    expect(lengths.has(4)).toBe(true)
    expect(lengths.has(5)).toBe(true)
  })

  it("includes MRs with optional conflicts and stale flags", () => {
    const withConflicts = platformCoreFixture.mrs.filter((mr) => mr.conflicts === true)
    const withStale = platformCoreFixture.mrs.filter((mr) => mr.stale === true)
    expect(withConflicts.length).toBeGreaterThanOrEqual(1)
    expect(withStale.length).toBeGreaterThanOrEqual(1)
  })
})
