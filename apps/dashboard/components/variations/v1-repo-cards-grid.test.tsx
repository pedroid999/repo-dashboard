import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { V1RepoCardsGrid } from "./v1-repo-cards-grid"

describe("V1 · RepoCardsGrid (AS-7)", () => {
  it("renders exactly 12 repo cards and the wireframe heading", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V1RepoCardsGrid />
      </DatasetProvider>
    )
    expect(
      screen.getByRole("heading", { name: /repos/i, level: 2 })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId("repo-card")).toHaveLength(12)
  })
})
