import { describe, it, expect } from "vitest"

describe("apps/dashboard data-source singleton (AS-9, DM-5 async)", () => {
  it("resolves to the same reference on repeated imports", async () => {
    const a = await import("./data-source")
    const b = await import("./data-source")
    expect(a.dataSource).toBe(b.dataSource)
    await expect(a.getDataset()).resolves.toEqual(await b.getDataset())
  })

  it("is backed by MockDataSource bound to the platform-core fixture", async () => {
    const { dataSource, getDataset } = await import("./data-source")
    const ds = await getDataset()
    expect(ds.repos.length).toBeGreaterThan(0)
    await expect(dataSource.getDataset()).resolves.toEqual(ds)
  })
})
