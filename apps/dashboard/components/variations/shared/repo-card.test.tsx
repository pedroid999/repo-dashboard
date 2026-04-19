import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { RepoCard } from "./repo-card"

describe("RepoCard", () => {
  const sample = platformCoreFixture.repos[0]

  it("renders the repo name, owner chip, and one PipelineRow per pipeline", () => {
    render(<RepoCard repo={sample} />)
    expect(screen.getByText(sample.name)).toBeInTheDocument()
    expect(screen.getByText(sample.owner)).toBeInTheDocument()
    expect(screen.getAllByTestId("pipeline-row")).toHaveLength(
      sample.pipelines.length
    )
  })

  it("surfaces failed / running counts in pills when present", () => {
    const failedRepo = platformCoreFixture.repos.find((r) =>
      r.pipelines.some((p) => p.status === "failed")
    )
    if (!failedRepo) throw new Error("Fixture must contain a failed pipeline")
    render(<RepoCard repo={failedRepo} mrCount={3} />)
    expect(screen.getByText(/\d+ fail$/)).toBeInTheDocument()
    expect(screen.getByText(/3 MR/)).toBeInTheDocument()
  })
})
