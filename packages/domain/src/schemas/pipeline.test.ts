import { describe, it, expect } from "vitest"

import { Pipeline } from "@workspace/domain/schemas/pipeline"

const validPipeline = {
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

describe("Pipeline", () => {
  it("parses a well-formed pipeline", () => {
    const parsed = Pipeline.safeParse(validPipeline)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.branch).toBe("main")
      expect(parsed.data.status).toBe("passed")
      expect(parsed.data.stages).toHaveLength(5)
    }
  })

  it("rejects a pipeline missing the status field", () => {
    const noStatus: Record<string, unknown> = { ...validPipeline }
    delete noStatus.status
    const parsed = Pipeline.safeParse(noStatus)
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path.includes("status"))).toBe(true)
    }
  })

  it("rejects an unknown status enum value", () => {
    const parsed = Pipeline.safeParse({ ...validPipeline, status: "exploded" })
    expect(parsed.success).toBe(false)
  })

  it("rejects a non-numeric id", () => {
    const parsed = Pipeline.safeParse({ ...validPipeline, id: "not-a-number" })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path.includes("id"))).toBe(true)
    }
  })

  it("accepts nested release branches like 'release/1.12'", () => {
    const parsed = Pipeline.safeParse({ ...validPipeline, branch: "release/1.12" })
    expect(parsed.success).toBe(true)
  })

  it("accepts variable-length stages arrays (length 3 and 5)", () => {
    const short = Pipeline.safeParse({ ...validPipeline, stages: ["ok", "ok", "ok"] })
    expect(short.success).toBe(true)

    const long = Pipeline.safeParse({
      ...validPipeline,
      stages: ["ok", "ok", "fail", "skip", "skip"],
    })
    expect(long.success).toBe(true)
  })

  it("rejects invalid stage values", () => {
    const parsed = Pipeline.safeParse({
      ...validPipeline,
      stages: ["ok", "ok", "invalid", "skip"],
    })
    expect(parsed.success).toBe(false)
  })
})
