import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const routerPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

const setThemeSpy = vi.fn()
let themeValue = "dark"
vi.mock("@workspace/ui/components/theme-provider", () => ({
  useTheme: () => ({
    theme: themeValue,
    setTheme: (t: string) => {
      themeValue = t
      setThemeSpy(t)
    },
  }),
}))

import { TweaksPanel } from "./tweaks-panel"

beforeEach(() => {
  localStorage.clear()
  document.body.className = ""
  routerPush.mockClear()
  setThemeSpy.mockClear()
  themeValue = "dark"
})

afterEach(() => {
  localStorage.clear()
  document.body.className = ""
})

describe("TweaksPanel (AS-8 · ADR-12)", () => {
  it("opens when the trigger is clicked and shows the Tweaks heading", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    expect(screen.getByRole("heading", { name: "Tweaks" })).toBeInTheDocument()
  })

  it("toggling paperGrid adds paper-on to <body> and persists to localStorage", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    const gridBtn = screen.getByRole("button", { name: /grid papel/i })
    await user.click(gridBtn)
    expect(document.body.classList.contains("paper-on")).toBe(true)
    const stored = JSON.parse(localStorage.getItem("tweaks") ?? "{}")
    expect(stored.paperGrid).toBe(true)
  })

  it("does NOT render a groupBy control (ADR-12)", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    expect(screen.queryByText(/Agrupar por/i)).not.toBeInTheDocument()
  })

  it("ignores postMessage edit-mode events (no listener attached)", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "__activate_edit_mode" },
        })
      )
    })
    expect(screen.getByRole("heading", { name: "Tweaks" })).toBeInTheDocument()
  })

  it("density toggle cycles cozy <-> compact and writes to localStorage", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    const densityBtn = screen.getByRole("button", { name: /densidad/i })
    expect(densityBtn.textContent).toMatch(/cozy/i)
    await user.click(densityBtn)
    expect(densityBtn.textContent).toMatch(/compact/i)
    await user.click(densityBtn)
    expect(densityBtn.textContent).toMatch(/cozy/i)
    const stored = JSON.parse(localStorage.getItem("tweaks") ?? "{}")
    expect(["cozy", "compact"]).toContain(stored.density)
  })

  it("rough toggle flips on/off and persists", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    const roughBtn = screen.getByRole("button", { name: /rough borders/i })
    expect(roughBtn.textContent).toMatch(/on/i)
    await user.click(roughBtn)
    expect(roughBtn.textContent).toMatch(/off/i)
    const stored = JSON.parse(localStorage.getItem("tweaks") ?? "{}")
    expect(stored.rough).toBe(false)
  })

  it("theme toggle delegates to useTheme().setTheme (not a local state)", async () => {
    const user = userEvent.setup()
    render(<TweaksPanel />)
    await user.click(screen.getByRole("button", { name: /tweaks/i }))
    const themeBtn = screen.getByLabelText(/^Theme$/i)
    await user.click(themeBtn)
    expect(setThemeSpy).toHaveBeenCalledWith("light")
  })
})
