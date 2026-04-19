import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const routerPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

import { Sidebar } from "./sidebar"

describe("Sidebar (AS-4)", () => {
  it("renders the Proyecto / Vista / Equipo section labels in order", () => {
    render(<Sidebar />)
    const labels = screen
      .getAllByRole("heading", { level: 3 })
      .map((n) => n.textContent)
    expect(labels).toEqual(["Proyecto", "Vista", "Equipo"])
  })

  it("marks platform-core as the current project via aria-current=page", () => {
    render(<Sidebar />)
    const active = screen.getByText("platform-core").closest("[aria-current]")
    expect(active?.getAttribute("aria-current")).toBe("page")
  })

  it("renders data-mesh and mobile-suite without marking them current", () => {
    render(<Sidebar />)
    const dataMesh = screen.getByText("data-mesh").closest("[aria-current]")
    const mobile = screen.getByText("mobile-suite").closest("[aria-current]")
    expect(dataMesh).toBeNull()
    expect(mobile).toBeNull()
  })

  it("clicking a non-active project does NOT call router.push", async () => {
    routerPush.mockClear()
    render(<Sidebar />)
    await userEvent.click(screen.getByText("data-mesh"))
    await userEvent.click(screen.getByText("mobile-suite"))
    expect(routerPush).not.toHaveBeenCalled()
  })

  it("renders the four Vista entries with wireframe copy", () => {
    render(<Sidebar />)
    expect(screen.getByText("Pipelines")).toBeInTheDocument()
    expect(screen.getByText("Merge Requests")).toBeInTheDocument()
    expect(screen.getByText("Ramas")).toBeInTheDocument()
    expect(screen.getByText("Actividad")).toBeInTheDocument()
  })

  it("renders the four team entries (backend, frontend, platform, data)", () => {
    render(<Sidebar />)
    expect(screen.getByText("backend")).toBeInTheDocument()
    expect(screen.getByText("frontend")).toBeInTheDocument()
    expect(screen.getByText("platform")).toBeInTheDocument()
    expect(screen.getByText("data")).toBeInTheDocument()
  })

  it("has the TL brand stamp with TechLead label", () => {
    render(<Sidebar />)
    expect(screen.getByText("TL")).toBeInTheDocument()
    expect(screen.getByText("TechLead")).toBeInTheDocument()
  })
})
