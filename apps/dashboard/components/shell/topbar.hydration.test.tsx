import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

type UseThemeValue = {
  theme: string | undefined
  resolvedTheme: string | undefined
  setTheme: (t: string) => void
}

const setThemeSpy = vi.fn()
let mockUseTheme: UseThemeValue = {
  theme: undefined,
  resolvedTheme: undefined,
  setTheme: setThemeSpy,
}

vi.mock("@workspace/ui/components/theme-provider", () => ({
  useTheme: () => mockUseTheme,
}))

import { Topbar } from "./topbar"

const __dirname = dirname(fileURLToPath(import.meta.url))
const topbarSourcePath = resolve(__dirname, "./topbar.tsx")

beforeEach(() => {
  setThemeSpy.mockClear()
  mockUseTheme = {
    theme: undefined,
    resolvedTheme: undefined,
    setTheme: setThemeSpy,
  }
})

afterEach(() => {
  vi.useRealTimers()
})

describe("Topbar hydration contract (HD-1..HD-5, RT-2)", () => {
  it("Scenario 1 (pre-mount / SSR): theme button is disabled, has aria-label=Theme, and contains no Sun/Moon svg", () => {
    mockUseTheme = {
      theme: undefined,
      resolvedTheme: undefined,
      setTheme: setThemeSpy,
    }

    const html = renderToString(<Topbar />)
    const doc = new DOMParser().parseFromString(html, "text/html")

    const themeBtn = doc.querySelector('button[aria-label="Theme"]')
    expect(themeBtn).not.toBeNull()
    expect(themeBtn?.hasAttribute("disabled")).toBe(true)

    const inner = themeBtn?.innerHTML ?? ""
    expect(inner).not.toContain("<svg")
    expect(inner).not.toContain("M13 9.5A5 5 0 116.5 3")
    expect(inner).not.toContain('cx="8"')
  })

  it("Scenario 2 (post-mount, resolvedTheme=dark via system): renders SunIcon, enabled, clicking calls setTheme('light')", async () => {
    mockUseTheme = {
      theme: "system",
      resolvedTheme: "dark",
      setTheme: setThemeSpy,
    }

    render(<Topbar />)

    const btn = screen.getByRole("button", { name: /theme/i })
    expect(btn).not.toBeDisabled()

    const svg = btn.querySelector("svg")
    expect(svg).not.toBeNull()
    expect(svg?.innerHTML ?? "").toContain('cx="8"')

    const user = userEvent.setup()
    await user.click(btn)
    expect(setThemeSpy).toHaveBeenCalledWith("light")
  })

  it("Scenario 3 (post-mount, resolvedTheme=light via system): renders MoonIcon, enabled, clicking calls setTheme('dark')", async () => {
    mockUseTheme = {
      theme: "system",
      resolvedTheme: "light",
      setTheme: setThemeSpy,
    }

    render(<Topbar />)

    const btn = screen.getByRole("button", { name: /theme/i })
    expect(btn).not.toBeDisabled()

    const svg = btn.querySelector("svg")
    expect(svg).not.toBeNull()
    expect(svg?.innerHTML ?? "").toContain("M13 9.5A5 5 0 116.5 3")

    const user = userEvent.setup()
    await user.click(btn)
    expect(setThemeSpy).toHaveBeenCalledWith("dark")
  })

  it("Scenario 4: topbar.tsx source does NOT contain suppressHydrationWarning", () => {
    const src = readFileSync(topbarSourcePath, "utf8")
    expect(src).not.toContain("suppressHydrationWarning")
  })
})
