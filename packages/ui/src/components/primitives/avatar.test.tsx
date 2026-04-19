import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Avatar } from "@workspace/ui/components/primitives/avatar"

describe("<Avatar />", () => {
  it("renders initials PN for 'Pedro Nieto' and carries role=img + aria-label", () => {
    render(<Avatar name="Pedro Nieto" />)
    const node = screen.getByRole("img", { name: /pedro nieto/i })
    expect(node.textContent).toBe("PN")
  })

  it("handles single-char names without crashing and still has role=img", () => {
    render(<Avatar name="x" />)
    const node = screen.getByRole("img", { name: /x/i })
    expect(node.textContent?.length).toBeGreaterThanOrEqual(1)
  })

  it("forwards className additively", () => {
    const { container } = render(<Avatar name="Ada Lovelace" className="extra" />)
    const root = container.firstElementChild!
    expect(root.classList.contains("av")).toBe(true)
    expect(root.classList.contains("extra")).toBe(true)
  })
})
