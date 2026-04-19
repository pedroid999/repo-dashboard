import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const nextThemesSpy = vi.fn()

vi.mock("next-themes", async () => {
  const React = await import("react")
  const ThemeCtx = React.createContext<{
    theme: string
    setTheme: (t: string) => void
  }>({
    theme: "dark",
    setTheme: () => {},
  })

  const ThemeProvider = (props: Record<string, unknown>) => {
    nextThemesSpy(props)
    const [theme, setThemeState] = React.useState<string>(
      (props.defaultTheme as string | undefined) ?? "dark"
    )
    const setTheme = React.useCallback((next: string) => {
      setThemeState(next)
      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = next
      }
    }, [])
    return React.createElement(
      ThemeCtx.Provider,
      { value: { theme, setTheme } },
      props.children as React.ReactNode
    )
  }

  const useTheme = () => React.useContext(ThemeCtx)
  return { ThemeProvider, useTheme }
})

import { ThemeProvider, useTheme } from "@workspace/ui/components/theme-provider"

beforeEach(() => {
  nextThemesSpy.mockClear()
  document.documentElement.dataset.theme = ""
})

describe("<ThemeProvider /> (UIC-6 · ADR-3)", () => {
  it("passes the locked props to next-themes", () => {
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    )
    expect(nextThemesSpy).toHaveBeenCalledTimes(1)
    const call = nextThemesSpy.mock.calls[0]![0] as Record<string, unknown>
    expect(call.attribute).toBe("data-theme")
    expect(call.defaultTheme).toBe("dark")
    expect(call.enableSystem).toBe(true)
    expect(call.disableTransitionOnChange).toBe(true)
  })

  it("re-exports useTheme; setTheme('light') flips document.documentElement.dataset.theme", async () => {
    function Child() {
      const { setTheme } = useTheme()
      return (
        <button type="button" onClick={() => setTheme("light")}>
          go light
        </button>
      )
    }

    render(
      <ThemeProvider>
        <Child />
      </ThemeProvider>
    )

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "go light" }))
    })

    expect(document.documentElement.dataset.theme).toBe("light")
  })

  it("renders children", () => {
    render(
      <ThemeProvider>
        <span data-testid="probe">ok</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId("probe")).toBeTruthy()
  })
})
