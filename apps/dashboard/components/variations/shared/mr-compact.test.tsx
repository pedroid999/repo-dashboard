import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { MrCompact } from "./mr-compact"

describe("MrCompact", () => {
  it("renders one compact row per MR", () => {
    render(<MrCompact mrs={platformCoreFixture.mrs} />)
    expect(screen.getAllByTestId("mr-compact-row")).toHaveLength(
      platformCoreFixture.mrs.length
    )
  })
})
