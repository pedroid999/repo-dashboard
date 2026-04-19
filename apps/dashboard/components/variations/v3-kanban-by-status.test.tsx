import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { V3KanbanByStatus } from "./v3-kanban-by-status"

describe("V3 · KanbanByStatus (AS-7)", () => {
  it("renders 3 columns with the wireframe heading", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V3KanbanByStatus />
      </DatasetProvider>
    )
    expect(
      screen.getByRole("heading", { name: /Tablero por estado/i })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId("kanban-column")).toHaveLength(3)
  })

  it("column counts match countByStatus for platformCoreFixture (15/5/4)", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V3KanbanByStatus />
      </DatasetProvider>
    )
    const counts = screen
      .getAllByTestId("kanban-count")
      .map((n) => Number(n.textContent))
    counts.sort((a, b) => b - a)
    expect(counts).toEqual([15, 5, 4])
  })

  it("omits the '+N más' overflow caption when passed <= 8", () => {
    const firstRepo = platformCoreFixture.repos[0]!
    const trimmed = {
      ...platformCoreFixture,
      repos: [
        {
          ...firstRepo,
          pipelines: firstRepo.pipelines.slice(0, 2),
        },
      ],
    }
    render(
      <DatasetProvider dataset={trimmed}>
        <V3KanbanByStatus />
      </DatasetProvider>
    )
    expect(screen.queryByText(/más$/)).not.toBeInTheDocument()
  })
})
