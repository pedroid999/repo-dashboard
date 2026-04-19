import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...rest }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider" data-props={JSON.stringify(rest)}>
      {children}
    </div>
  ),
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}))

vi.mock("@workspace/ui/fonts", () => ({
  hand: {
    variable: "__font-sans-test",
    className: "__font-sans-test-cls",
    style: { fontFamily: "Space Grotesk" },
  },
  mono: {
    variable: "__font-mono-test",
    className: "__font-mono-test-cls",
    style: { fontFamily: "JetBrains Mono" },
  },
  display: {
    variable: "__font-display-test",
    className: "__font-display-test-cls",
    style: { fontFamily: "Orbitron" },
  },
}))

import RootLayout from "../app/layout"

function renderLayoutMarkup(): string {
  const element = (
    <RootLayout>
      <div data-testid="child">content</div>
    </RootLayout>
  )
  return renderToStaticMarkup(element)
}

describe("RootLayout (Phase 7 · AS-3, UIC-2, UIC-6)", () => {
  it("wires the three workspace/ui font variables onto <html>", () => {
    const markup = renderLayoutMarkup()
    expect(markup).toMatch(/<html[^>]*class="[^"]*__font-sans-test[^"]*"/)
    expect(markup).toMatch(/<html[^>]*class="[^"]*__font-mono-test[^"]*"/)
    expect(markup).toMatch(/<html[^>]*class="[^"]*__font-display-test[^"]*"/)
  })

  it('sets lang="es" on <html>', () => {
    const markup = renderLayoutMarkup()
    expect(markup).toMatch(/<html[^>]*lang="es"/)
  })

  it("wraps children in the ThemeProvider (from @workspace/ui)", () => {
    const markup = renderLayoutMarkup()
    expect(markup).toContain('data-testid="theme-provider"')
    expect(markup).toContain('data-testid="child"')
    const providerIdx = markup.indexOf('data-testid="theme-provider"')
    const childIdx = markup.indexOf('data-testid="child"')
    expect(providerIdx).toBeLessThan(childIdx)
  })
})
