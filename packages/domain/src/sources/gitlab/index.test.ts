import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { Dataset } from "@workspace/domain/schemas/dataset"
import { GitLabDataSource } from "@workspace/domain/sources/gitlab/index"

import projectFixture from "./__fixtures__/project.json" with { type: "json" }
import pipelinesFixture from "./__fixtures__/pipelines.json" with { type: "json" }
import jobsFixture from "./__fixtures__/jobs.json" with { type: "json" }
import commitFixture from "./__fixtures__/commit.json" with { type: "json" }
import mrsFixture from "./__fixtures__/merge_requests.json" with { type: "json" }

type Headers = Record<string, string>
type FetchCall = { url: string; init: RequestInit & { headers: Headers } }

function makeResponse<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

interface RouteOverrides {
  pipelines?: unknown
  jobs?: unknown
  commit?: unknown
  mergeRequests?: unknown
  approvals?: unknown
  project?: unknown
}

function installFetchStub(overrides: RouteOverrides = {}) {
  const calls: FetchCall[] = []
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init: (init ?? {}) as FetchCall["init"] })
    if (url.includes("/pipelines/") && url.includes("/jobs")) {
      return makeResponse(overrides.jobs ?? jobsFixture)
    }
    if (url.includes("/merge_requests/") && url.includes("/approvals")) {
      return makeResponse(
        overrides.approvals ?? { approvals_required: 2, approvals_left: 1 }
      )
    }
    if (url.includes("/pipelines")) {
      return makeResponse(overrides.pipelines ?? pipelinesFixture)
    }
    if (url.includes("/repository/commits/")) {
      return makeResponse(overrides.commit ?? commitFixture)
    }
    if (url.includes("/merge_requests")) {
      return makeResponse(overrides.mergeRequests ?? mrsFixture)
    }
    return makeResponse(overrides.project ?? projectFixture)
  })
  vi.stubGlobal("fetch", fetchImpl)
  return { fetchImpl, calls }
}

describe("GitLabDataSource.getDataset (GL-5)", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("happy path: fetches + maps + parses into a valid Dataset", async () => {
    installFetchStub()
    const adapter = new GitLabDataSource({
      host: "https://gitlab.example.com",
      token: "glpat-abc",
      projectIds: ["platform-core/auth-service"],
    })
    const dataset = await adapter.getDataset()
    expect(Dataset.safeParse(dataset).success).toBe(true)
    expect(dataset.repos).toHaveLength(1)
    expect(dataset.repos[0]?.name).toBe("auth-service")
    expect(dataset.repos[0]?.pipelines).toHaveLength(2)
    expect(dataset.mrs.map((mr) => mr.repo)).toContain("auth-service")
    expect(dataset.mrs.some((mr) => mr.id === 522)).toBe(true)
  })

  it("skips a single bad pipeline and still returns the rest (partial failure)", async () => {
    const chaosPipelines = [
      {
        id: 99999,
        sha: "aaaaaaaaaaaa",
        ref: "main",
        status: "chaos",
        duration: 10,
        created_at: new Date().toISOString(),
        user: { username: "kaos" },
      },
      ...pipelinesFixture,
    ]
    installFetchStub({ pipelines: chaosPipelines })
    const adapter = new GitLabDataSource({
      host: "https://gitlab.example.com",
      token: "glpat-abc",
      projectIds: ["platform-core/auth-service"],
    })
    const dataset = await adapter.getDataset()
    const pipelines = dataset.repos[0]?.pipelines ?? []
    expect(pipelines.some((p) => p.id === 99999)).toBe(false)
    expect(pipelines.length).toBe(pipelinesFixture.length)
    expect(console.warn).toHaveBeenCalled()
  })

  it("propagates transport errors from fetch (5xx) without swallowing them", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    )
    const adapter = new GitLabDataSource({
      host: "https://gitlab.example.com",
      token: "glpat-abc",
      projectIds: ["platform-core/auth-service"],
    })
    await expect(adapter.getDataset()).rejects.toThrow(/GitLab/i)
  })

  it("iterates every configured project id", async () => {
    const { calls } = installFetchStub()
    const adapter = new GitLabDataSource({
      host: "https://gitlab.example.com",
      token: "glpat-abc",
      projectIds: ["pc/auth", "pc/api"],
    })
    const dataset = await adapter.getDataset()
    expect(dataset.repos).toHaveLength(2)
    const projectCalls = calls.filter((c) => /\/projects\/[^/]+$/.test(c.url))
    expect(projectCalls.map((c) => c.url.split("/").pop())).toEqual(
      expect.arrayContaining(["pc%2Fauth", "pc%2Fapi"])
    )
  })
})
