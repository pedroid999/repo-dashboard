import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import { Repo } from "@workspace/domain/schemas/repo"
import { MockDataSource } from "@workspace/domain/sources/mock-data-source"

describe("MockDataSource", () => {
  it("returns the full dataset from getDataset()", () => {
    const source = new MockDataSource()
    const dataset = source.getDataset()
    expect(dataset.project).toBe("platform-core")
    expect(dataset).toBe(platformCoreFixture)
  })

  it("lists every repo from the fixture via listRepos()", () => {
    const source = new MockDataSource()
    const repos = source.listRepos()
    expect(repos).toHaveLength(platformCoreFixture.repos.length)
    for (const repo of repos) {
      expect(Repo.safeParse(repo).success).toBe(true)
    }
  })

  it("lists every merge request from the fixture via listMRs()", () => {
    const source = new MockDataSource()
    const mrs = source.listMRs()
    expect(mrs).toHaveLength(platformCoreFixture.mrs.length)
    expect(mrs.map((mr) => mr.repo)).toContain("auth-service")
  })

  it("returns the matching repo from getRepo(name)", () => {
    const source = new MockDataSource()
    const repo = source.getRepo("auth-service")
    expect(repo).toBeDefined()
    expect(repo?.name).toBe("auth-service")
    expect(repo?.owner).toBe("backend")
  })

  it("returns undefined for an unknown repo name", () => {
    const source = new MockDataSource()
    expect(source.getRepo("does-not-exist")).toBeUndefined()
  })

  it("accepts an injected dataset (for future test scenarios)", () => {
    const custom = {
      project: "empty",
      repos: [],
      mrs: [],
    }
    const source = new MockDataSource(custom)
    expect(source.listRepos()).toEqual([])
    expect(source.listMRs()).toEqual([])
    expect(source.getRepo("anything")).toBeUndefined()
  })
})
