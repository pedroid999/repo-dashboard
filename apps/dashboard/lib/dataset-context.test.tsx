import { describe, it, expect } from "vitest"
import { render, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { DatasetProvider, useDataset } from "./dataset-context"
import { platformCoreFixture } from "@workspace/domain"

describe("DatasetProvider + useDataset (AS-9)", () => {
  it("exposes the dataset via useDataset", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <DatasetProvider dataset={platformCoreFixture}>{children}</DatasetProvider>
    )
    const { result } = renderHook(() => useDataset(), { wrapper })
    expect(result.current).toBe(platformCoreFixture)
  })

  it("throws a descriptive error when used outside a provider", () => {
    expect(() => renderHook(() => useDataset())).toThrow(/DatasetProvider/)
  })

  it("both children see the same dataset reference", () => {
    let ref1: unknown = null
    let ref2: unknown = null
    const Leaf = ({ store }: { store: (d: unknown) => void }) => {
      store(useDataset())
      return null
    }
    render(
      <DatasetProvider dataset={platformCoreFixture}>
        <Leaf store={(d) => (ref1 = d)} />
        <Leaf store={(d) => (ref2 = d)} />
      </DatasetProvider>
    )
    expect(ref1).toBe(ref2)
    expect(ref1).toBe(platformCoreFixture)
  })
})
