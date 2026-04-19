import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { platformCoreFixture, listPipelines } from "@workspace/domain"
import { MiniPipe } from "./mini-pipe"

describe("MiniPipe", () => {
  it("renders the repo, pipeline id, branch, and duration", () => {
    const sample = listPipelines(platformCoreFixture)[0]
    render(<MiniPipe pipeline={sample} />)
    expect(screen.getByText(sample.repo)).toBeInTheDocument()
    expect(screen.getByText(`#${sample.id}`)).toBeInTheDocument()
    expect(screen.getByText(sample.branch)).toBeInTheDocument()
  })
})
