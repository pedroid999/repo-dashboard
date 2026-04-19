import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import { Repo } from "@workspace/domain/schemas/repo"
import { MockDataSource } from "@workspace/domain/sources/mock-data-source"

describe("MockDataSource (DM-5 async)", () => {
  it("resolves the full dataset from getDataset()", async () => {
    const source = new MockDataSource()
    await expect(source.getDataset()).resolves.toEqual(platformCoreFixture)
  })

  it("resolves every repo from the fixture via listRepos()", async () => {
    const source = new MockDataSource()
    const repos = await source.listRepos()
    expect(repos).toHaveLength(platformCoreFixture.repos.length)
    for (const repo of repos) {
      expect(Repo.safeParse(repo).success).toBe(true)
    }
  })

  it("resolves every merge request from the fixture via listMRs()", async () => {
    const source = new MockDataSource()
    const mrs = await source.listMRs()
    expect(mrs).toHaveLength(platformCoreFixture.mrs.length)
    expect(mrs.map((mr) => mr.repo)).toContain("auth-service")
  })

  it("resolves the matching repo from getRepo(name)", async () => {
    const source = new MockDataSource()
    const repo = await source.getRepo("auth-service")
    expect(repo).toBeDefined()
    expect(repo?.name).toBe("auth-service")
    expect(repo?.owner).toBe("backend")
  })

  it("resolves undefined for an unknown repo name", async () => {
    const source = new MockDataSource()
    await expect(source.getRepo("does-not-exist")).resolves.toBeUndefined()
  })

  it("accepts an injected dataset (for future test scenarios)", async () => {
    const custom = {
      project: "empty",
      repos: [],
      mrs: [],
    }
    const source = new MockDataSource(custom)
    await expect(source.listRepos()).resolves.toEqual([])
    await expect(source.listMRs()).resolves.toEqual([])
    await expect(source.getRepo("anything")).resolves.toBeUndefined()
  })
})
