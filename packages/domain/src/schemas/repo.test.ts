import { describe, it, expect } from "vitest"

import { Repo } from "@workspace/domain/schemas/repo"

const pipelineFixture = {
  branch: "main",
  id: 149605,
  status: "passed",
  dur: "00:03:46",
  age: "12m",
  author: "aitor",
  commit: "4e6a514f",
  title: "fix(auth): refresh token TTL",
  stages: ["ok", "ok", "ok", "ok", "ok"],
}

describe("Repo", () => {
  it("parses a repo with nested pipelines", () => {
    const parsed = Repo.safeParse({
      name: "api-gateway",
      owner: "backend",
      pipelines: [pipelineFixture],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.name).toBe("api-gateway")
      expect(parsed.data.pipelines).toHaveLength(1)
    }
  })

  it("accepts a repo with an empty pipelines array", () => {
    const parsed = Repo.safeParse({ name: "docs-site", owner: "frontend", pipelines: [] })
    expect(parsed.success).toBe(true)
  })

  it("rejects a repo missing the pipelines field", () => {
    const parsed = Repo.safeParse({ name: "api-gateway", owner: "backend" })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path.includes("pipelines"))).toBe(true)
    }
  })

  it("rejects a repo with malformed pipelines", () => {
    const parsed = Repo.safeParse({
      name: "api-gateway",
      owner: "backend",
      pipelines: [{ ...pipelineFixture, status: "exploded" }],
    })
    expect(parsed.success).toBe(false)
  })
})
