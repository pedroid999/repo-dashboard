import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { V4TableList } from "./v4-table-list"

describe("V4 · TableList (AS-7)", () => {
  it("renders 24 pipeline rows sorted failed → running → passed", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V4TableList />
      </DatasetProvider>
    )
    expect(
      screen.getByRole("heading", { name: /Todas las pipelines/i })
    ).toBeInTheDocument()
    const rows = screen.getAllByTestId("pipeline-table-row")
    expect(rows).toHaveLength(24)
    const statuses = rows.map((row) => {
      const pill = within(row).getByText(/Passed|Failed|Running/)
      return pill.textContent?.trim().toLowerCase()
    })
    const rank: Record<string, number> = { failed: 0, running: 1, passed: 2 }
    for (let i = 1; i < statuses.length; i++) {
      expect(rank[statuses[i] ?? ""] ?? 99).toBeGreaterThanOrEqual(
        rank[statuses[i - 1] ?? ""] ?? 99
      )
    }
  })
})
