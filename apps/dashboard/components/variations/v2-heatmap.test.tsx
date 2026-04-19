import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture, listPipelines } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { V2Heatmap } from "./v2-heatmap"

describe("V2 · Heatmap (AS-7)", () => {
  it("renders 12 rows and cells matching listPipelines(ds).length", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V2Heatmap />
      </DatasetProvider>
    )
    expect(
      screen.getByRole("heading", { name: /Matriz repos × tiempo/i })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId("heatmap-row")).toHaveLength(12)
    const totalCells = screen.getAllByTestId("heatmap-cell").length
    expect(totalCells).toBe(listPipelines(platformCoreFixture).length)
  })
})
