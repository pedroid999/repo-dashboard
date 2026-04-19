import { describe, it, expect } from "vitest"

import { platformCoreFixture } from "@workspace/domain/fixtures/platform-core"
import type { MergeRequest } from "@workspace/domain/schemas/mr"
import { listStaleMrs } from "@workspace/domain/selectors/list-stale-mrs"

function baseMr(partial: Partial<MergeRequest>): MergeRequest {
  return {
    repo: "r1",
    id: 1,
    title: "t",
    author: "a",
    from: "f",
    to: "t",
    reviewers: [],
    ci: "ok",
    days: 0,
    approvals: "0/0",
    ...partial,
  }
}

describe("listStaleMrs", () => {
  it("returns fixture-anchored 1 stale MR with id 61", () => {
    const stale = listStaleMrs(platformCoreFixture.mrs)
    expect(stale).toHaveLength(1)
    expect(stale[0]?.id).toBe(61)
  })

  it("matches explicit stale === true regardless of days", () => {
    const mrs = [baseMr({ id: 10, stale: true, days: 0 })]
    expect(listStaleMrs(mrs).map((m) => m.id)).toEqual([10])
  })

  it("uses strict > threshold boundary (days=5 excluded, days=6 included)", () => {
    const mrs = [
      baseMr({ id: 100, stale: false, days: 5 }),
      baseMr({ id: 101, stale: false, days: 6 }),
    ]
    expect(listStaleMrs(mrs).map((m) => m.id)).toEqual([101])
  })

  it("returns [] for empty input", () => {
    expect(listStaleMrs([])).toEqual([])
  })

  it("preserves input order", () => {
    const mrs = [
      baseMr({ id: 201, stale: true }),
      baseMr({ id: 202, days: 10 }),
      baseMr({ id: 203, stale: true }),
    ]
    expect(listStaleMrs(mrs).map((m) => m.id)).toEqual([201, 202, 203])
  })
})
