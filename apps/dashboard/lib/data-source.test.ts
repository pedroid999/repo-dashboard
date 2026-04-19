import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

/**
 * Factory matrix tests (GL-2, GL-3, GL-4, DM-5).
 *
 * The factory reads env vars at module eval time; each test resets modules
 * and re-imports so the factory re-resolves the current env snapshot.
 */

function withEnv(
  env: Record<string, string | undefined>,
  fn: () => Promise<void>
): () => Promise<void> {
  return async () => {
    const previous: Record<string, string | undefined> = {}
    for (const key of Object.keys(env)) {
      previous[key] = process.env[key]
      const value = env[key]
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
    try {
      vi.resetModules()
      await fn()
    } finally {
      for (const key of Object.keys(previous)) {
        const value = previous[key]
        if (value === undefined) {
          delete process.env[key]
        } else {
          process.env[key] = value
        }
      }
      vi.resetModules()
    }
  }
}

describe("apps/dashboard data-source factory (GL-2, GL-3, GL-4, DM-5)", () => {
  beforeEach(() => {
    delete process.env.DATA_SOURCE
    delete process.env.GITLAB_HOST
    delete process.env.GITLAB_TOKEN
    delete process.env.GITLAB_PROJECT_IDS
    vi.resetModules()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it(
    "returns a MockDataSource when DATA_SOURCE is unset (default)",
    withEnv({ DATA_SOURCE: undefined }, async () => {
      const { dataSource, getDataset } = await import("./data-source")
      const { MockDataSource } = await import("@workspace/domain")
      expect(dataSource).toBeInstanceOf(MockDataSource)
      const ds = await getDataset()
      expect(ds.repos.length).toBeGreaterThan(0)
    })
  )

  it(
    'returns a MockDataSource when DATA_SOURCE="mock"',
    withEnv({ DATA_SOURCE: "mock" }, async () => {
      const { dataSource } = await import("./data-source")
      const { MockDataSource } = await import("@workspace/domain")
      expect(dataSource).toBeInstanceOf(MockDataSource)
    })
  )

  it(
    'returns a GitLabDataSource when DATA_SOURCE="gitlab"',
    withEnv(
      {
        DATA_SOURCE: "gitlab",
        GITLAB_TOKEN: "glpat-abc",
        GITLAB_PROJECT_IDS: "platform-core/auth",
      },
      async () => {
        const { dataSource } = await import("./data-source")
        const { GitLabDataSource } = await import(
          "@workspace/domain/sources/gitlab/index"
        )
        expect(dataSource).toBeInstanceOf(GitLabDataSource)
      }
    )
  )

  it(
    'throws when DATA_SOURCE="graphql" with a message naming mock|gitlab',
    withEnv({ DATA_SOURCE: "graphql" }, async () => {
      await expect(import("./data-source")).rejects.toThrow(
        /DATA_SOURCE.*inv[aá]lido.*mock.*gitlab/i
      )
    })
  )

  it(
    "throws when DATA_SOURCE=gitlab but GITLAB_TOKEN is unset",
    withEnv(
      {
        DATA_SOURCE: "gitlab",
        GITLAB_TOKEN: undefined,
        GITLAB_PROJECT_IDS: "platform-core/auth",
      },
      async () => {
        await expect(import("./data-source")).rejects.toThrow(
          /GITLAB_TOKEN is required/
        )
      }
    )
  )

  it(
    'throws when DATA_SOURCE=gitlab but GITLAB_PROJECT_IDS=""',
    withEnv(
      {
        DATA_SOURCE: "gitlab",
        GITLAB_TOKEN: "glpat-abc",
        GITLAB_PROJECT_IDS: "",
      },
      async () => {
        await expect(import("./data-source")).rejects.toThrow(
          /GITLAB_PROJECT_IDS must list at least one project/
        )
      }
    )
  )

  it(
    "error message for invalid DATA_SOURCE never leaks a provided GITLAB_TOKEN",
    withEnv(
      {
        DATA_SOURCE: "bogus",
        GITLAB_TOKEN: "glpat-supersecret-xyz",
      },
      async () => {
        try {
          await import("./data-source")
          throw new Error("expected throw")
        } catch (err) {
          expect((err as Error).message).not.toContain("glpat-supersecret-xyz")
        }
      }
    )
  )

  it(
    "singleton: repeated imports resolve to the same instance (mock default)",
    withEnv({ DATA_SOURCE: "mock" }, async () => {
      const a = await import("./data-source")
      const b = await import("./data-source")
      expect(a.dataSource).toBe(b.dataSource)
      const [ds1, ds2] = await Promise.all([a.getDataset(), b.getDataset()])
      expect(ds1).toEqual(ds2)
    })
  )
})
