import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { MiniMr } from "./mini-mr"

describe("MiniMr", () => {
  it("renders author, repo identifier, and title", () => {
    const sample = platformCoreFixture.mrs[0]
    render(<MiniMr mr={sample} />)
    expect(screen.getByText(sample.title)).toBeInTheDocument()
    expect(
      screen.getByText(`${sample.repo}!${sample.id}`)
    ).toBeInTheDocument()
  })

  it("shows a conflict pill when mr.conflicts is true", () => {
    const conflict = platformCoreFixture.mrs.find((m) => m.conflicts)
    if (!conflict) throw new Error("Fixture must include a conflicted MR")
    render(<MiniMr mr={conflict} />)
    expect(screen.getByText(/conflict/i)).toBeInTheDocument()
  })
})
