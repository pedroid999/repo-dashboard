import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import Loading from "./loading"

describe("app/loading.tsx (GL-8)", () => {
  it("renders a region with role=status so assistive tech announces it", () => {
    const { container } = render(<Loading />)
    const status = container.querySelector('[role="status"]')
    expect(status).not.toBeNull()
  })

  it("provides a Spanish aria-label announcing the loading state", () => {
    const { container } = render(<Loading />)
    const status = container.querySelector('[role="status"]')
    expect(status?.getAttribute("aria-label") ?? "").toMatch(
      /cargando dashboard/i
    )
  })

  it("renders at least one skeleton primitive to fill shell layout", () => {
    const { container } = render(<Loading />)
    const skeletons = container.querySelectorAll("[data-skeleton]")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("uses background/foreground Kanagawa tokens (not hardcoded hex)", () => {
    const { container } = render(<Loading />)
    const html = container.innerHTML
    expect(html).toMatch(/bg-background|bg-card/)
    expect(html).not.toMatch(/#[0-9a-fA-F]{6}/)
  })
})
