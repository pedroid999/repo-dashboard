import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { MrTimeline } from "./mr-timeline"

describe("MrTimeline", () => {
  it("renders a row per MR with days-open text", () => {
    render(<MrTimeline mrs={platformCoreFixture.mrs} />)
    const rows = screen.getAllByTestId("mr-timeline-row")
    expect(rows).toHaveLength(platformCoreFixture.mrs.length)
    expect(screen.getAllByText(/d abierta/).length).toBe(
      platformCoreFixture.mrs.length
    )
  })
})
