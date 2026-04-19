import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Pill } from "@workspace/ui/components/primitives/pill"

describe("<Pill />", () => {
  it("renders children inside a rough-bordered container", () => {
    const { container, getByText } = render(<Pill>badge</Pill>)
    expect(getByText("badge")).toBeTruthy()
    const root = container.firstElementChild!
    expect(root.classList.contains("pill")).toBe(true)
  })

  it("forwards className additively", () => {
    const { container } = render(<Pill className="extra">x</Pill>)
    const root = container.firstElementChild!
    expect(root.classList.contains("pill")).toBe(true)
    expect(root.classList.contains("extra")).toBe(true)
  })

  it("has no implicit role (visual container)", () => {
    const { container } = render(<Pill>x</Pill>)
    expect(container.firstElementChild!.getAttribute("role")).toBeNull()
  })
})
