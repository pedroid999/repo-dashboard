import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import type { SVGProps } from "react"
import {
  BranchIcon,
  CheckIcon,
  ChevIcon,
} from "@workspace/ui/icons"
import * as Icons from "@workspace/ui/icons"

const EXPECTED_ICON_NAMES = [
  "BranchIcon",
  "CommitIcon",
  "ClockIcon",
  "CalIcon",
  "MrIcon",
  "CheckIcon",
  "XIcon",
  "PlayIcon",
  "SearchIcon",
  "RefreshIcon",
  "FilterIcon",
  "SunIcon",
  "MoonIcon",
  "PipeIcon",
  "DlIcon",
  "WorkspaceIcon",
  "GroupIcon",
  "SubgroupIcon",
  "ProjectIcon",
  "ChevIcon",
] as const

describe("@workspace/ui/icons — representative deep checks", () => {
  it("BranchIcon renders a single <svg> with stroke-width 1.4", () => {
    const { container } = render(<BranchIcon data-testid="branch" />)
    const svgs = container.querySelectorAll("svg")
    expect(svgs.length).toBe(1)
    const svg = svgs[0]!
    expect(svg.getAttribute("stroke-width")).toBe("1.4")
  })

  it("CheckIcon renders with stroke-width 1.8", () => {
    const { container } = render(<CheckIcon />)
    const svg = container.querySelector("svg")!
    expect(svg.getAttribute("stroke-width")).toBe("1.8")
  })

  it("ChevIcon renders with stroke-width 1.6", () => {
    const { container } = render(<ChevIcon />)
    const svg = container.querySelector("svg")!
    expect(svg.getAttribute("stroke-width")).toBe("1.6")
  })

  it("renders a <title> child when title prop is provided (a11y)", () => {
    const { getByTitle } = render(<BranchIcon title="rama principal" />)
    const titled = getByTitle("rama principal")
    expect(titled).toBeDefined()
  })

  it("does NOT render a <title> element when title prop is absent", () => {
    const { container } = render(<BranchIcon />)
    expect(container.querySelector("title")).toBeNull()
  })
})

describe("@workspace/ui/icons — typed signature", () => {
  it("all exports satisfy React.FC<SVGProps<SVGSVGElement>>-compatible signature", () => {
    const typedList: Array<React.FC<SVGProps<SVGSVGElement>>> = [
      Icons.BranchIcon,
      Icons.CommitIcon,
      Icons.ClockIcon,
      Icons.CalIcon,
      Icons.MrIcon,
      Icons.CheckIcon,
      Icons.XIcon,
      Icons.PlayIcon,
      Icons.SearchIcon,
      Icons.RefreshIcon,
      Icons.FilterIcon,
      Icons.SunIcon,
      Icons.MoonIcon,
      Icons.PipeIcon,
      Icons.DlIcon,
      Icons.WorkspaceIcon,
      Icons.GroupIcon,
      Icons.SubgroupIcon,
      Icons.ProjectIcon,
      Icons.ChevIcon,
    ]
    expect(typedList.length).toBe(20)
    for (const Icon of typedList) {
      expect(typeof Icon).toBe("function")
    }
  })
})

describe("@workspace/ui/icons — barrel sanity", () => {
  it("exports exactly the 20 expected icon names as function components", () => {
    for (const name of EXPECTED_ICON_NAMES) {
      const exported = (Icons as unknown as Record<string, unknown>)[name]
      expect(exported, `expected export ${name} to exist`).toBeDefined()
      expect(typeof exported).toBe("function")
    }
  })

  it("every icon renders a single <svg> and honours the title prop", () => {
    for (const name of EXPECTED_ICON_NAMES) {
      const Icon = (Icons as unknown as Record<string, React.FC<SVGProps<SVGSVGElement>>>)[name]!
      const withoutTitle = render(<Icon />)
      expect(withoutTitle.container.querySelectorAll("svg").length).toBe(1)
      expect(withoutTitle.container.querySelector("title")).toBeNull()
      withoutTitle.unmount()

      const withTitle = render(
        <Icon {...({ title: `${name}-title` } as Record<string, string>)} />
      )
      const titleNode = withTitle.container.querySelector("title")
      expect(titleNode?.textContent).toBe(`${name}-title`)
      withTitle.unmount()
    }
  })
})
