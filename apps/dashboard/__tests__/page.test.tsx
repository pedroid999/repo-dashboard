import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import Page from "../app/page"

describe("app/page RSC (AS-3)", () => {
  it("resolves v=v3 search param into the rendered shell", async () => {
    const element = await Page({ searchParams: Promise.resolve({ v: "v3" }) })
    const { getByTestId } = render(element)
    const shell = getByTestId("dashboard-shell")
    expect(shell.getAttribute("data-variation")).toBe("v3")
  })

  it("falls back to v1 when the search param is missing", async () => {
    const missing = await Page({ searchParams: Promise.resolve({}) })
    const { getByTestId } = render(missing)
    expect(getByTestId("dashboard-shell").getAttribute("data-variation")).toBe(
      "v1"
    )
  })

  it("falls back to v1 when the search param is invalid", async () => {
    const invalid = await Page({
      searchParams: Promise.resolve({ v: "hacker" }),
    })
    const { getByTestId } = render(invalid)
    expect(getByTestId("dashboard-shell").getAttribute("data-variation")).toBe(
      "v1"
    )
  })
})
