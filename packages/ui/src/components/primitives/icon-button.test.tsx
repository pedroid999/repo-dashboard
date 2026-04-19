import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IconButton } from "@workspace/ui/components/primitives/icon-button"

const Dot = () => <svg data-testid="dot" />

describe("<IconButton />", () => {
  it("renders a button wrapping the passed icon with an accessible name", () => {
    render(<IconButton icon={<Dot />} label="refrescar" />)
    const btn = screen.getByRole("button", { name: "refrescar" })
    expect(btn.querySelector('[data-testid="dot"]')).toBeTruthy()
  })

  it("fires onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon={<Dot />} label="r" onClick={onClick} />)
    await user.click(screen.getByRole("button", { name: "r" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("propagates disabled and aria-pressed", () => {
    render(
      <IconButton icon={<Dot />} label="r" disabled aria-pressed />
    )
    const btn = screen.getByRole("button", { name: "r" })
    expect(btn.hasAttribute("disabled")).toBe(true)
    expect(btn.getAttribute("aria-pressed")).toBe("true")
  })

  it("forwards className additively", () => {
    render(<IconButton icon={<Dot />} label="x" className="tone-muted" />)
    const btn = screen.getByRole("button", { name: "x" })
    expect(btn.classList.contains("iconbtn")).toBe(true)
    expect(btn.classList.contains("tone-muted")).toBe(true)
  })
})
