import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect, beforeAll, afterEach } from "vitest"

const __dirname = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(__dirname, "./globals.css")
let css: string

beforeAll(() => {
  css = readFileSync(cssPath, "utf8")
})

afterEach(() => {
  document.head.querySelectorAll("style[data-test-tokens]").forEach((el) => el.remove())
  document.documentElement.removeAttribute("data-theme")
  document.body.className = ""
})

function extractScope(source: string, selector: string): string {
  // Find the matching selector block (naive brace-matching, good enough for CSS here)
  const idx = source.indexOf(selector)
  if (idx === -1) return ""
  const open = source.indexOf("{", idx)
  if (open === -1) return ""
  let depth = 1
  let i = open + 1
  while (i < source.length && depth > 0) {
    const ch = source[i]
    if (ch === "{") depth++
    else if (ch === "}") depth--
    i++
  }
  return source.slice(open + 1, i - 1)
}

describe("globals.css — Kanagawa tokens (UIC-1)", () => {
  it("defines Kanagawa Wave (dark) tokens under :root / [data-theme=\"dark\"]", () => {
    const dark =
      extractScope(css, ":root, [data-theme=\"dark\"]") ||
      extractScope(css, ":root,[data-theme=\"dark\"]")
    expect(dark).toContain("--bg: #1f1f28")
    expect(dark).toContain("--bg-2: #2a2a37")
    expect(dark).toContain("--bg-3: #363646")
    expect(dark).toContain("--ink: #dcd7ba")
    expect(dark).toContain("--ink-2: #c8c093")
    expect(dark).toContain("--ink-3: #727169")
    expect(dark).toContain("--line: #54546d")
    expect(dark).toContain("--line-2: #363646")
    expect(dark).toContain("--ok: #98bb6c")
    expect(dark).toContain("--fail: #e46876")
    expect(dark).toContain("--run: #e6c384")
    expect(dark).toContain("--link: #7fb4ca")
    expect(dark).toContain("--purple: #957fb8")
    expect(dark).toMatch(/--ok-bg:/)
    expect(dark).toMatch(/--fail-bg:/)
    expect(dark).toMatch(/--run-bg:/)
    expect(dark).toMatch(/--link-bg:/)
  })

  it("defines Kanagawa Lotus (light) tokens under [data-theme=\"light\"]", () => {
    const light = extractScope(css, "[data-theme=\"light\"]")
    expect(light).toContain("--bg: #f2ecbc")
    expect(light).toContain("--bg-2: #e9e0c4")
    expect(light).toContain("--bg-3: #dcd5ad")
    expect(light).toContain("--ink: #545464")
    expect(light).toContain("--ink-2: #43436c")
    expect(light).toContain("--ink-3: #8a8980")
    expect(light).toContain("--line: #a09cac")
    expect(light).toContain("--line-2: #c9c9a7")
    expect(light).toContain("--ok: #6f894e")
    expect(light).toContain("--fail: #c84053")
    expect(light).toContain("--run: #77713f")
    expect(light).toContain("--link: #4d699b")
    expect(light).toContain("--purple: #624c83")
  })

  it("resolves CSS custom props at runtime when a <style> fragment is injected", () => {
    const fragment = `:root, [data-theme="dark"] { --bg: #1f1f28; } [data-theme="light"] { --bg: #f2ecbc; }`
    const style = document.createElement("style")
    style.setAttribute("data-test-tokens", "true")
    style.textContent = fragment
    document.head.appendChild(style)

    document.documentElement.setAttribute("data-theme", "dark")
    expect(
      getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
    ).toBe("#1f1f28")

    document.documentElement.setAttribute("data-theme", "light")
    expect(
      getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
    ).toBe("#f2ecbc")
  })
})

describe("globals.css — rough / dashed utilities (UIC-3)", () => {
  it("declares .rough, .rough-2, .rough-sm, .dashed utilities", () => {
    expect(css).toMatch(/\.rough\s*\{/)
    expect(css).toMatch(/\.rough-2\s*\{/)
    expect(css).toMatch(/\.rough-sm\s*\{/)
    expect(css).toMatch(/\.dashed\s*\{/)
  })

  it("uses asymmetric four-corner border-radius on .rough", () => {
    const rough = extractScope(css, ".rough ")
    expect(rough).toContain("border-radius: 10px 12px 9px 11px / 11px 9px 12px 10px")
  })

  it("applies the wireframe asymmetric border-radius at runtime", () => {
    const fragment = `.rough { border: 1.5px solid black; border-radius: 10px 12px 9px 11px / 11px 9px 12px 10px; }`
    const style = document.createElement("style")
    style.setAttribute("data-test-tokens", "true")
    style.textContent = fragment
    document.head.appendChild(style)

    const div = document.createElement("div")
    div.className = "rough"
    document.body.appendChild(div)
    const radius = getComputedStyle(div).borderRadius
    expect(radius).toMatch(/10px\s+12px\s+9px\s+11px/)
    div.remove()
  })
})

describe("globals.css — paper-grid (UIC-4)", () => {
  it("declares body.paper-on with a radial-gradient background", () => {
    expect(css).toMatch(/body\.paper-on\s*\{[\s\S]*radial-gradient[\s\S]*var\(--line-2\)/)
  })

  it("applies a radial-gradient backgroundImage when paper-on is toggled", () => {
    const fragment =
      `body.paper-on { background-image: radial-gradient(var(--line-2) 0.8px, transparent 0.8px); background-size: 22px 22px; }`
    const style = document.createElement("style")
    style.setAttribute("data-test-tokens", "true")
    style.textContent = fragment
    document.head.appendChild(style)

    document.body.classList.add("paper-on")
    const bg = getComputedStyle(document.body).backgroundImage
    expect(bg).toContain("radial-gradient")
  })
})
