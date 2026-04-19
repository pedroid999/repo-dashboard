import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusPill } from "@workspace/ui/components/primitives/status-pill"

describe("<StatusPill />", () => {
  it("renders Passed with check icon and .ok modifier", () => {
    const { container } = render(<StatusPill status="passed" />)
    expect(screen.getByText("Passed")).toBeTruthy()
    const root = container.firstElementChild!
    expect(root.classList.contains("pill")).toBe(true)
    expect(root.classList.contains("ok")).toBe(true)
    expect(root.querySelectorAll("svg").length).toBeGreaterThanOrEqual(1)
    expect(root.getAttribute("aria-label")).toMatch(/passed/i)
  })

  it("renders Failed with x icon and .fail modifier", () => {
    const { container } = render(<StatusPill status="failed" />)
    expect(screen.getByText("Failed")).toBeTruthy()
    const root = container.firstElementChild!
    expect(root.classList.contains("fail")).toBe(true)
    expect(root.getAttribute("aria-label")).toMatch(/failed/i)
  })

  it("renders Running with play icon and .run modifier", () => {
    const { container } = render(<StatusPill status="running" />)
    expect(screen.getByText("Running")).toBeTruthy()
    const root = container.firstElementChild!
    expect(root.classList.contains("run")).toBe(true)
    expect(root.getAttribute("aria-label")).toMatch(/running/i)
  })

  it("supports a small variant and forwards className additively", () => {
    const { container } = render(
      <StatusPill status="passed" small className="extra" />
    )
    const root = container.firstElementChild!
    expect(root.classList.contains("pill--small")).toBe(true)
    expect(root.classList.contains("extra")).toBe(true)
  })

  it("rejects invalid status values at compile time", () => {
    // @ts-expect-error — status must be one of the three literals
    const bad = <StatusPill status="exploded" />
    expect(bad).toBeTruthy()
  })
})
