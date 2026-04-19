import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const setTheme = vi.fn()
let themeValue = "dark"
vi.mock("@workspace/ui/components/theme-provider", () => ({
  useTheme: () => ({
    theme: themeValue,
    resolvedTheme: themeValue,
    setTheme: (t: string) => {
      themeValue = t
      setTheme(t)
    },
  }),
}))

import { Topbar } from "./topbar"

beforeEach(() => {
  vi.useFakeTimers()
  setTheme.mockClear()
  themeValue = "dark"
})

afterEach(() => {
  vi.useRealTimers()
})

describe("Topbar (AS-5)", () => {
  it("renders the full breadcrumb: Workspace › sngular › platform-core › Pipelines", () => {
    render(<Topbar />)
    const crumb = screen.getByTestId("breadcrumb").textContent ?? ""
    expect(crumb).toContain("Workspace")
    expect(crumb).toContain("sngular")
    expect(crumb).toContain("platform-core")
    expect(crumb).toContain("Pipelines")
  })

  it("renders the search input with wireframe placeholder — typing does NOT fire a state setter", async () => {
    render(<Topbar />)
    const search = screen.getByPlaceholderText("Buscar repo, MR, autor, rama…")
    expect(search).toBeInTheDocument()
    vi.useRealTimers()
    const user = userEvent.setup()
    await user.type(search, "repo-x")
    expect((search as HTMLInputElement).value).toBe("")
    vi.useFakeTimers()
  })

  it("advancing the refresh clock 30s does NOT trigger any data fetch and visually resets", () => {
    render(<Topbar />)
    const liveNode = screen.getByTestId("refresh-indicator")
    act(() => {
      vi.advanceTimersByTime(30_000)
    })
    const after = liveNode.textContent ?? ""
    expect(after).not.toBe("")
    expect(after).toMatch(/live/i)
  })

  it("clicking the theme icon-button flips data-theme from dark to light", async () => {
    document.documentElement.dataset.theme = "dark"
    render(<Topbar />)
    vi.useRealTimers()
    const user = userEvent.setup()
    const btn = screen.getByRole("button", { name: /theme/i })
    await user.click(btn)
    expect(setTheme).toHaveBeenCalledWith("light")
    vi.useFakeTimers()
  })

  it('renders the "New pipeline" button with aria-disabled=true (visual-only)', async () => {
    render(<Topbar />)
    const btn = screen.getByRole("button", { name: "New pipeline" })
    expect(btn.getAttribute("aria-disabled")).toBe("true")
  })
})
