import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Squiggle } from "@workspace/ui/components/primitives/squiggle"

describe("<Squiggle />", () => {
  it("renders a single decorative svg with role=presentation", () => {
    const { container } = render(<Squiggle />)
    const svgs = container.querySelectorAll("svg")
    expect(svgs.length).toBe(1)
    expect(svgs[0]!.getAttribute("role")).toBe("presentation")
  })
})
