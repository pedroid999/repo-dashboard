import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, expect, it } from "vitest"

const __dirname = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(__dirname, "./globals.css")
let css = ""

beforeAll(() => {
  css = readFileSync(cssPath, "utf8")
})

describe("wireframe-coverage: font aliases (SW-1)", () => {
  it("declares --hand aliasing to --font-sans", () => {
    expect(css).toContain("--hand: var(--font-sans)")
  })
  it("declares --mono aliasing to --font-mono", () => {
    expect(css).toContain("--mono: var(--font-mono)")
  })
  it("declares --display aliasing to --font-display", () => {
    expect(css).toContain("--display: var(--font-display)")
  })
  it("declares the alias trio inside [data-theme=\"light\"] scope too", () => {
    const lightIdx = css.indexOf('[data-theme="light"]')
    expect(lightIdx).toBeGreaterThan(-1)
    const lightScope = css.slice(lightIdx)
    expect(lightScope).toContain("--hand: var(--font-sans)")
    expect(lightScope).toContain("--mono: var(--font-mono)")
    expect(lightScope).toContain("--display: var(--font-display)")
  })
})

describe("wireframe-coverage: typography utilities (SW-2)", () => {
  it.each([
    [".mono {"],
    [".hand {"],
    [".muted {"],
    [".faint {"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: layout shell (SW-3)", () => {
  it.each([
    [".app {"],
    ["grid-template-columns: 220px 1fr"],
    [".sidebar {"],
    [".brand .logo"],
    [".navi.active"],
    [".sq {"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: main/topbar chrome (SW-4)", () => {
  it.each([
    [".main {"],
    [".topbar {"],
    [".crumb b"],
    [".search {"],
    [".iconbtn {"],
    [".btn.primary"],
    [".dot-live"],
    ["@keyframes pulse"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
  it("declares .iconbtn with 34x34 dimensions", () => {
    expect(css).toMatch(/\.iconbtn\s*\{[^}]*width:\s*34px[^}]*height:\s*34px/)
  })
  it("declares .dot-live animation referencing pulse", () => {
    expect(css).toMatch(/animation:\s*pulse\s+1\.6s\s+infinite/)
  })
})

describe("wireframe-coverage: tabs (SW-5)", () => {
  it.each([
    [".tabs {"],
    [".tab.active"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: pills + chips (SW-6)", () => {
  it.each([
    [".pill {"],
    [".pill.ok"],
    [".pill.fail"],
    [".pill.run"],
    [".pill.link"],
    [".pill.neutral"],
    [".chip {"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: avatar + status dots + wline (SW-7)", () => {
  it.each([
    [".av {"],
    [".sdot.ok"],
    [".sdot.fail"],
    [".sdot.run"],
    [".wline {"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
  it(".sdot.run uses pulse 1.4s", () => {
    expect(css).toMatch(/\.sdot\.run\s*\{[^}]*animation:\s*pulse\s+1\.4s\s+infinite/)
  })
})

describe("wireframe-coverage: section header + density (SW-8, SW-9)", () => {
  it.each([
    [".section-h h2"],
    ['[data-density="compact"] .card'],
    ['[data-density="comfortable"] .row'],
    [".card {"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: tweaks (SW-10)", () => {
  it.each([
    [".tweaks-panel {"],
    [".tweaks-panel.open"],
    [".note-stamp"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})

describe("wireframe-coverage: variations / misc (SW-11..SW-21)", () => {
  it.each([
    [".kan {"],
    [".kan .col"],
    [".gridR {"],
    [".tl .bar"],
    [".tl .seg"],
    [".squiggle {"],
    [".th {"],
    [".tbl-row:first-of-type"],
    [".legend {"],
    [".hm {"],
    [".hm .cell.ok"],
    [".hm .cell.fail"],
    [".hm .cell.run"],
    [".paper {"],
    [".notebox {"],
    [".notebox b"],
    [".scroll-fade"],
    ["@media (max-width: 1100px)"],
  ])("contains %s", (needle) => {
    expect(css).toContain(needle)
  })
})
