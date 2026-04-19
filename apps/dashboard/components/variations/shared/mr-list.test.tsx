import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { MrList } from "./mr-list"

describe("MrList", () => {
  it("renders one row per MR with identifiers and titles", () => {
    render(<MrList mrs={platformCoreFixture.mrs} />)
    const rows = screen.getAllByTestId("mr-row")
    expect(rows).toHaveLength(platformCoreFixture.mrs.length)
    expect(
      screen.getByText(platformCoreFixture.mrs[0].title)
    ).toBeInTheDocument()
  })

  it("marks MRs that have conflicts with a dedicated pill", () => {
    const withConflict = platformCoreFixture.mrs.find((m) => m.conflicts)
    if (!withConflict) throw new Error("Fixture must include a conflicted MR")
    render(<MrList mrs={[withConflict]} />)
    expect(screen.getByTestId("mr-conflict")).toBeInTheDocument()
  })
})
