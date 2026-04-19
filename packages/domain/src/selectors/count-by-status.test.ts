import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import { countByStatus } from "@workspace/domain/selectors/count-by-status"
import { listPipelines } from "@workspace/domain/selectors/list-pipelines"

describe("countByStatus", () => {
  it("returns the fixture-anchored tally { passed: 15, failed: 5, running: 4 }", () => {
    const counts = countByStatus(listPipelines(platformCoreFixture))
    expect(counts).toEqual({ passed: 15, failed: 5, running: 4 })
  })

  it("zero-fills missing buckets", () => {
    const allPassed = listPipelines(platformCoreFixture).filter(
      (p) => p.status === "passed"
    )
    const counts = countByStatus(allPassed)
    expect(counts.passed).toBe(allPassed.length)
    expect(counts.failed).toBe(0)
    expect(counts.running).toBe(0)
  })

  it("returns { passed: 0, failed: 0, running: 0 } for empty input", () => {
    expect(countByStatus([])).toEqual({ passed: 0, failed: 0, running: 0 })
  })

  it("maintains invariant: passed + failed + running === input.length", () => {
    const pipelines = listPipelines(platformCoreFixture)
    const c = countByStatus(pipelines)
    expect(c.passed + c.failed + c.running).toBe(pipelines.length)
  })
})
