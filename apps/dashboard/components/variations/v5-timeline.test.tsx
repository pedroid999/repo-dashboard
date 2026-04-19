import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { DatasetProvider } from "../../lib/dataset-context"
import { V5Timeline } from "./v5-timeline"

describe("V5 · Timeline (AS-7)", () => {
  it("renders 12 timeline rows and the MR timeline section", () => {
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <V5Timeline />
      </DatasetProvider>
    )
    expect(
      screen.getByRole("heading", { name: /Timeline de pipelines/i })
    ).toBeInTheDocument()
    expect(screen.getAllByTestId("timeline-row")).toHaveLength(12)
    expect(screen.getByTestId("mr-timeline")).toBeInTheDocument()
  })
})
