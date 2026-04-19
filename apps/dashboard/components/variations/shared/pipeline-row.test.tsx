import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture } from "@workspace/domain"
import { PipelineRow } from "./pipeline-row"

describe("PipelineRow", () => {
  const sample = platformCoreFixture.repos[0].pipelines[0]

  it("renders branch, short commit, duration, and status pill", () => {
    render(<PipelineRow pipeline={sample} />)
    expect(screen.getByText(sample.branch)).toBeInTheDocument()
    expect(screen.getByText(sample.commit)).toBeInTheDocument()
    expect(screen.getByText(sample.dur)).toBeInTheDocument()
    expect(screen.getByText(`#${sample.id}`)).toBeInTheDocument()
  })
})
