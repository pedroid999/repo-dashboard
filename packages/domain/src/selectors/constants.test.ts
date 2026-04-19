import { describe, it, expect } from "vitest"

import { STALE_DAYS_THRESHOLD } from "@workspace/domain/selectors/constants"

describe("STALE_DAYS_THRESHOLD", () => {
  it("is exactly 5 (business rule source of truth)", () => {
    expect(STALE_DAYS_THRESHOLD).toBe(5)
  })
})
