import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import type { Dataset } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { AttentionBar } from "./attention-bar"

function renderWithDataset(dataset: Dataset) {
  return render(
    <DatasetProvider dataset={dataset}>
      <AttentionBar />
    </DatasetProvider>
  )
}

describe("AttentionBar (AS-6)", () => {
  it("shows the Spanish heading verbatim from the wireframe", () => {
    renderWithDataset(platformCoreFixture)
    expect(screen.getByText("Necesita atención")).toBeInTheDocument()
  })

  it("renders 5 red pipelines + 4 running + 2 blocked MRs + 1 stale MR for platformCoreFixture", () => {
    renderWithDataset(platformCoreFixture)
    const region = screen.getByRole("region", { name: /atención/i })
    const failedRow = within(region).getByText(/pipelines rojas/i).closest("span")
    expect(failedRow).not.toBeNull()
    expect(failedRow?.textContent).toMatch(/5/)

    const runningRow = within(region).getByText(/corriendo/i).closest("span")
    expect(runningRow?.textContent).toMatch(/4/)

    const blockedRow = within(region)
      .getByText(/MRs bloqueadas/i)
      .closest("span")
    expect(blockedRow?.textContent).toMatch(/2/)

    const staleRow = within(region).getByText(/MRs viejas/i).closest("span")
    expect(staleRow?.textContent).toMatch(/1/)
  })

  it("falls back to all zeros for an empty synthetic dataset", () => {
    const empty: Dataset = { repos: [], mrs: [] }
    renderWithDataset(empty)
    const region = screen.getByRole("region", { name: /atención/i })
    const numbers = within(region)
      .getAllByTestId("attention-count")
      .map((n) => n.textContent?.trim())
    expect(numbers).toEqual(["0", "0", "0", "0"])
  })
})
