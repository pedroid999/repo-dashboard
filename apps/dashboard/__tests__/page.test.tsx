import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

vi.mock("@workspace/ui/components/theme-provider", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}))

import Page from "../app/page"

describe("app/page RSC (AS-3)", () => {
  it("resolves v=v3 search param into the rendered shell", async () => {
    const element = await Page({ searchParams: Promise.resolve({ v: "v3" }) })
    const { getByTestId } = render(element)
    expect(getByTestId("variation-v3")).toBeInTheDocument()
  })

  it("falls back to v1 when the search param is missing", async () => {
    const missing = await Page({ searchParams: Promise.resolve({}) })
    const { getByTestId } = render(missing)
    expect(getByTestId("variation-v1")).toBeInTheDocument()
  })

  it("falls back to v1 when the search param is invalid", async () => {
    const invalid = await Page({
      searchParams: Promise.resolve({ v: "hacker" }),
    })
    const { getByTestId } = render(invalid)
    expect(getByTestId("variation-v1")).toBeInTheDocument()
  })
})
