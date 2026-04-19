import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import { listPipelines } from "@workspace/domain/selectors/list-pipelines"

describe("listPipelines", () => {
  it("flattens every pipeline across every repo (fixture anchor: 24)", () => {
    const pipelines = listPipelines(platformCoreFixture)
    expect(pipelines).toHaveLength(24)
  })

  it("annotates every pipeline with a string repo name matching a fixture repo", () => {
    const repoNames = new Set(platformCoreFixture.repos.map((r) => r.name))
    const pipelines = listPipelines(platformCoreFixture)
    for (const p of pipelines) {
      expect(typeof p.repo).toBe("string")
      expect(repoNames.has(p.repo)).toBe(true)
    }
  })

  it("preserves repo-source-order then pipeline-source-order", () => {
    const pipelines = listPipelines(platformCoreFixture)
    const expectedOrder: Array<[string, number]> = []
    for (const repo of platformCoreFixture.repos) {
      for (const pipeline of repo.pipelines) {
        expectedOrder.push([repo.name, pipeline.id])
      }
    }
    expect(pipelines.map((p) => [p.repo, p.id])).toEqual(expectedOrder)
  })

  it("returns [] when repos is empty", () => {
    const dataset = { ...platformCoreFixture, repos: [] }
    expect(listPipelines(dataset)).toEqual([])
  })
})
