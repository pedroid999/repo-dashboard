import { describe, it, expect } from "vitest"

import { MergeRequest } from "@workspace/domain/schemas/mr"

const validMr = {
  repo: "auth-service",
  id: 312,
  title: "feat(mfa): backup codes flow",
  author: "sara",
  from: "feature/mfa-backup",
  to: "develop",
  reviewers: ["noa", "aitor"],
  ci: "ok",
  days: 2,
  approvals: "1/2",
}

describe("MergeRequest", () => {
  it("parses a valid MR with all required fields", () => {
    const parsed = MergeRequest.safeParse(validMr)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.repo).toBe("auth-service")
      expect(parsed.data.reviewers).toEqual(["noa", "aitor"])
    }
  })

  it("accepts an MR without optional conflicts/stale flags", () => {
    const parsed = MergeRequest.safeParse(validMr)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.conflicts).toBeUndefined()
      expect(parsed.data.stale).toBeUndefined()
    }
  })

  it("parses an MR flagged as conflicts", () => {
    const parsed = MergeRequest.safeParse({ ...validMr, ci: "fail", conflicts: true })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.conflicts).toBe(true)
      expect(parsed.data.stale).toBeUndefined()
    }
  })

  it("parses an MR flagged as stale", () => {
    const parsed = MergeRequest.safeParse({ ...validMr, stale: true })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.stale).toBe(true)
    }
  })

  it("rejects an invalid ci value", () => {
    const parsed = MergeRequest.safeParse({ ...validMr, ci: "passed" })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path.includes("ci"))).toBe(true)
    }
  })

  it("rejects an MR missing reviewers", () => {
    const noReviewers: Record<string, unknown> = { ...validMr }
    delete noReviewers.reviewers
    const parsed = MergeRequest.safeParse(noReviewers)
    expect(parsed.success).toBe(false)
  })
})
