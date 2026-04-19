import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionHeader } from "@workspace/ui/components/primitives/section-header"

describe("<SectionHeader />", () => {
  it("renders headline as h2 by default", () => {
    render(<SectionHeader>Repos</SectionHeader>)
    const h2 = screen.getByRole("heading", { level: 2, name: "Repos" })
    expect(h2.tagName).toBe("H2")
  })

  it("supports configurable heading level via as", () => {
    render(<SectionHeader as="h3">Sub</SectionHeader>)
    const h3 = screen.getByRole("heading", { level: 3, name: "Sub" })
    expect(h3.tagName).toBe("H3")
  })

  it("renders actions on the right edge", () => {
    const { container } = render(
      <SectionHeader actions={<button>Go</button>}>Title</SectionHeader>
    )
    const actionsSlot = container.querySelector(".section-header__actions")
    expect(actionsSlot).toBeTruthy()
    expect(actionsSlot!.querySelector("button")?.textContent).toBe("Go")
  })

  it("carries the section-header class", () => {
    const { container } = render(<SectionHeader>Title</SectionHeader>)
    expect(container.firstElementChild!.classList.contains("section-header")).toBe(true)
  })

  it("forwards className additively", () => {
    const { container } = render(
      <SectionHeader className="extra">Title</SectionHeader>
    )
    expect(container.firstElementChild!.classList.contains("extra")).toBe(true)
  })

  it("omits actions slot when actions prop is not provided", () => {
    const { container } = render(<SectionHeader>Title</SectionHeader>)
    expect(container.querySelector(".section-header__actions")).toBeNull()
  })
})
