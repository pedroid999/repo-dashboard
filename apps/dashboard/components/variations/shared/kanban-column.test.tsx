import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { KanbanColumn } from "./kanban-column"

describe("KanbanColumn", () => {
  it("renders title, color class, count badge, and children", () => {
    render(
      <KanbanColumn title="Failed" color="fail" count={5}>
        <span>child</span>
      </KanbanColumn>
    )
    expect(screen.getByText("Failed")).toBeInTheDocument()
    expect(screen.getByTestId("kanban-count").textContent).toBe("5")
    expect(screen.getByTestId("kanban-column").getAttribute("data-color")).toBe(
      "fail"
    )
    expect(screen.getByText("child")).toBeInTheDocument()
  })
})
