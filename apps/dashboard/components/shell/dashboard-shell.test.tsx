import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { platformCoreFixture } from "@workspace/domain"

const routerPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

vi.mock("@workspace/ui/components/theme-provider", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}))

import { DashboardShell } from "./dashboard-shell"

beforeEach(() => {
  routerPush.mockClear()
  localStorage.clear()
})

describe("DashboardShell (AS-3)", () => {
  it('declares a single "use client" boundary at the top of the file', () => {
    const source = readFileSync(
      resolve(__dirname, "./dashboard-shell.tsx"),
      "utf8"
    )
    const trimmed = source.trimStart()
    expect(
      trimmed.startsWith('"use client"') ||
        trimmed.startsWith("'use client'")
    ).toBe(true)
  })

  it("mounts Sidebar, Topbar, AttentionBar, TweaksPanel and the variation screen", () => {
    render(
      <DashboardShell
        dataset={platformCoreFixture}
        initialVariation="v1"
      />
    )
    expect(screen.getByText("TechLead")).toBeInTheDocument()
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument()
    expect(screen.getByRole("region", { name: /atención/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^tweaks/i })).toBeInTheDocument()
    expect(screen.getByTestId("variation-v1")).toBeInTheDocument()
  })

  it("clicking the V4 tab calls router.push with ?v=v4 and swaps the rendered variation", async () => {
    const user = userEvent.setup()
    render(
      <DashboardShell
        dataset={platformCoreFixture}
        initialVariation="v1"
      />
    )
    await user.click(screen.getByRole("tab", { name: /V4/i }))
    expect(routerPush).toHaveBeenCalledWith(expect.stringContaining("v=v4"))
    expect(screen.getByTestId("variation-v4")).toBeInTheDocument()
  })

  it("exposes the dataset to descendants via DatasetProvider", () => {
    render(
      <DashboardShell
        dataset={platformCoreFixture}
        initialVariation="v1"
      />
    )
    expect(screen.getByText(/12\s*repos/i)).toBeInTheDocument()
  })
})
