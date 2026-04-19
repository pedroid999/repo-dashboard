import { describe, it, expect } from "vitest"

import { Dataset } from "@workspace/domain/schemas/dataset"

const pipeline = {
  branch: "main",
  id: 1,
  status: "passed",
  dur: "00:01:00",
  age: "1m",
  author: "sara",
  commit: "abc",
  title: "ok",
  stages: ["ok"],
}

const repo = { name: "api-gateway", owner: "backend", pipelines: [pipeline] }

const mr = {
  repo: "api-gateway",
  id: 42,
  title: "title",
  author: "sara",
  from: "feature/x",
  to: "develop",
  reviewers: ["noa"],
  ci: "ok",
  days: 1,
  approvals: "0/1",
}

describe("Dataset", () => {
  it("parses a valid composite dataset", () => {
    const parsed = Dataset.safeParse({
      project: "platform-core",
      repos: [repo],
      mrs: [mr],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.project).toBe("platform-core")
      expect(parsed.data.repos).toHaveLength(1)
      expect(parsed.data.mrs).toHaveLength(1)
    }
  })

  it("accepts a dataset with empty repos and mrs arrays", () => {
    const parsed = Dataset.safeParse({ project: "empty", repos: [], mrs: [] })
    expect(parsed.success).toBe(true)
  })

  it("rejects an MR referencing an unknown repo", () => {
    const parsed = Dataset.safeParse({
      project: "platform-core",
      repos: [repo],
      mrs: [{ ...mr, repo: "does-not-exist" }],
    })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path.includes("repo"))
      expect(issue).toBeDefined()
      expect(issue?.message ?? "").toContain("does-not-exist")
    }
  })

  it("rejects a dataset with a malformed nested pipeline stage", () => {
    const parsed = Dataset.safeParse({
      project: "platform-core",
      repos: [
        {
          ...repo,
          pipelines: [{ ...pipeline, stages: ["ok", "not-a-stage"] }],
        },
      ],
      mrs: [],
    })
    expect(parsed.success).toBe(false)
  })

  it("rejects a dataset missing the project field", () => {
    const parsed = Dataset.safeParse({ repos: [], mrs: [] })
    expect(parsed.success).toBe(false)
  })
})
