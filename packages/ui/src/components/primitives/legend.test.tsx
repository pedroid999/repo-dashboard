import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Legend } from "@workspace/ui/components/primitives/legend"

describe("<Legend />", () => {
  it("renders three listitems with passed/running/failed rows", () => {
    render(<Legend />)
    const list = screen.getByRole("list")
    expect(list).toBeTruthy()
    const items = screen.getAllByRole("listitem")
    expect(items.length).toBe(3)
  })

  it("each row exposes the matching StatusPill label", () => {
    render(<Legend />)
    expect(screen.getByText("Passed")).toBeTruthy()
    expect(screen.getByText("Failed")).toBeTruthy()
    expect(screen.getByText("Running")).toBeTruthy()
  })

  it("forwards className additively on the root <ul>", () => {
    const { container } = render(<Legend className="extra" />)
    const root = container.firstElementChild!
    expect(root.classList.contains("legend")).toBe(true)
    expect(root.classList.contains("extra")).toBe(true)
  })
})
