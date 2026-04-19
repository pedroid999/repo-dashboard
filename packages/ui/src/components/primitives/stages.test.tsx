import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Stages } from "@workspace/ui/components/primitives/stages"

describe("<Stages />", () => {
  it("renders exactly one dot per stage with matching modifier classes in order", () => {
    const { container } = render(
      <Stages stages={["ok", "ok", "fail", "skip"]} />
    )
    const dots = container.querySelectorAll(".sdot")
    expect(dots.length).toBe(4)
    const mods = Array.from(dots).map((d) =>
      Array.from(d.classList).filter((c) => c !== "sdot").join(" ")
    )
    expect(mods).toEqual(["ok", "ok", "fail", "skip"])
  })

  it("renders nothing visible on empty stages", () => {
    const { container } = render(<Stages stages={[]} />)
    expect(container.querySelectorAll(".sdot").length).toBe(0)
  })
})
