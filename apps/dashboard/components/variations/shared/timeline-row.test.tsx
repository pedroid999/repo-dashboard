import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { TimelineRow } from "./timeline-row"

describe("TimelineRow", () => {
  it("renders the repo name and at least one timeline bar", () => {
    const repo = platformCoreFixture.repos[0]
    render(<TimelineRow repo={repo} seed={0} />)
    expect(screen.getByText(repo.name)).toBeInTheDocument()
    expect(screen.getAllByTestId("timeline-bar").length).toBeGreaterThan(0)
  })
})
