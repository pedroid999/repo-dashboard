import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Chip } from "@workspace/ui/components/primitives/chip"

describe("<Chip />", () => {
  it("renders children with default variant", () => {
    const { container, getByText } = render(<Chip>hello</Chip>)
    expect(getByText("hello")).toBeTruthy()
    expect(container.firstElementChild?.classList.contains("chip")).toBe(true)
  })

  it("applies variant class muted|link|purple", () => {
    for (const variant of ["muted", "link", "purple"] as const) {
      const { container } = render(<Chip variant={variant}>x</Chip>)
      expect(container.firstElementChild?.classList.contains(`chip-${variant}`)).toBe(true)
    }
  })

  it("forwards title attribute", () => {
    const { container } = render(<Chip title="tooltip">x</Chip>)
    expect(container.firstElementChild?.getAttribute("title")).toBe("tooltip")
  })

  it("defaults variant to chip-default and forwards className", () => {
    const { container } = render(<Chip className="extra">x</Chip>)
    const root = container.firstElementChild!
    expect(root.classList.contains("chip-default")).toBe(true)
    expect(root.classList.contains("extra")).toBe(true)
  })

  it("renders an optional icon slot before children", () => {
    const { container, getByText } = render(
      <Chip icon={<span data-testid="icon" />}>txt</Chip>
    )
    expect(container.querySelector('[data-testid="icon"]')).toBeTruthy()
    expect(getByText("txt")).toBeTruthy()
  })
})
