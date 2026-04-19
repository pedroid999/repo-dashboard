import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import { listBlockedMrs } from "@workspace/domain/selectors/list-blocked-mrs"

describe("listBlockedMrs", () => {
  it("returns fixture-anchored 2 blocked MRs with ids 144 and 33 in source order", () => {
    const blocked = listBlockedMrs(platformCoreFixture.mrs)
    expect(blocked).toHaveLength(2)
    expect(blocked.map((m) => m.id)).toEqual([144, 33])
  })

  it("matches ci === 'fail' OR conflicts === true (OR logic)", () => {
    const mrs: MergeRequest[] = [
      {
        repo: "r1",
        id: 1,
        title: "ok",
        author: "a",
        from: "f",
        to: "t",
        reviewers: [],
        ci: "ok",
        days: 0,
        approvals: "0/0",
      },
      {
        repo: "r1",
        id: 2,
        title: "ci fail only",
        author: "a",
        from: "f",
        to: "t",
        reviewers: [],
        ci: "fail",
        days: 0,
        approvals: "0/0",
      },
      {
        repo: "r1",
        id: 3,
        title: "conflicts only",
        author: "a",
        from: "f",
        to: "t",
        reviewers: [],
        ci: "ok",
        days: 0,
        approvals: "0/0",
        conflicts: true,
      },
      {
        repo: "r1",
        id: 4,
        title: "both",
        author: "a",
        from: "f",
        to: "t",
        reviewers: [],
        ci: "fail",
        days: 0,
        approvals: "0/0",
        conflicts: true,
      },
    ]
    expect(listBlockedMrs(mrs).map((m) => m.id)).toEqual([2, 3, 4])
  })

  it("returns [] for empty input", () => {
    expect(listBlockedMrs([])).toEqual([])
  })
})
