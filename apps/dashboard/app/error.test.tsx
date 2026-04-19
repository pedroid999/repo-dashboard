import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ErrorBoundary from "./error"

describe("app/error.tsx (GL-3, GL-8)", () => {
  it("renders spanish copy + Reintentar button", () => {
    const reset = vi.fn()
    render(<ErrorBoundary error={new Error("boom")} reset={reset} />)

    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /algo sali[oó] mal/i
    )
    expect(
      screen.getByRole("button", { name: /reintentar/i })
    ).toBeDefined()
  })

  it("invokes reset() when the Reintentar button is clicked", () => {
    const reset = vi.fn()
    render(<ErrorBoundary error={new Error("boom")} reset={reset} />)

    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }))
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it("does not leak GITLAB_TOKEN value into rendered HTML (GL-3, GL-8)", () => {
    const leaky = new Error("GITLAB_TOKEN=glpat-supersecret-xyz invalid")
    const { container } = render(
      <ErrorBoundary error={leaky} reset={() => {}} />
    )

    expect(container.innerHTML).not.toContain("glpat-supersecret-xyz")
    expect(container.innerHTML).not.toContain("GITLAB_")
  })

  it("does not leak GITLAB_HOST, GITLAB_PROJECT_IDS, or any GITLAB_* env name", () => {
    const leaky = new Error(
      "Failed with GITLAB_HOST=https://gitlab.example.com and GITLAB_PROJECT_IDS=a,b,c"
    )
    const { container } = render(
      <ErrorBoundary error={leaky} reset={() => {}} />
    )

    expect(container.innerHTML).not.toContain("gitlab.example.com")
    expect(container.innerHTML).not.toContain("GITLAB_")
    expect(container.innerHTML).not.toContain("a,b,c")
  })

  it("shows a generic fallback when message is empty", () => {
    const { container } = render(
      <ErrorBoundary error={new Error("")} reset={() => {}} />
    )
    expect(container.textContent ?? "").toMatch(
      /intenta nuevamente|algo sali[oó] mal/i
    )
  })
})
