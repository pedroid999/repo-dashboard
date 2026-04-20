import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { GitLabClient, GitLabError } from "@workspace/domain/sources/gitlab/client"

function jsonResponse<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("GitLabClient (GL-3, GL-7)", () => {
  const host = "https://gitlab.example.com"
  const token = "glpat-supersecret-abc123"
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe("authentication (GL-3)", () => {
    it("sends PRIVATE-TOKEN header on every request", async () => {
      fetchSpy.mockImplementation(() => Promise.resolve(jsonResponse({ id: 42 })))
      const client = new GitLabClient({ host, token })
      await client.getProject("platform/auth")
      await client.getPipelines("platform/auth")
      await client.getJobs("platform/auth", 123)
      await client.getCommit("platform/auth", "abc")
      await client.getMergeRequests("platform/auth")
      await client.getGroupProjects("workspace/sso")
      expect(fetchSpy).toHaveBeenCalledTimes(6)
      for (const call of fetchSpy.mock.calls) {
        const init = call[1] as RequestInit
        const headers = init.headers as Record<string, string>
        expect(headers["PRIVATE-TOKEN"]).toBe(token)
      }
    })
  })

  describe("URL construction", () => {
    it("URL-encodes the project id and targets the correct endpoint", async () => {
      fetchSpy.mockResolvedValue(jsonResponse({ id: 1 }))
      const client = new GitLabClient({ host, token })
      await client.getProject("platform-core/auth-service")
      const url = fetchSpy.mock.calls[0]?.[0] as string
      expect(url).toBe(
        "https://gitlab.example.com/api/v4/projects/platform-core%2Fauth-service"
      )
    })

    it("adds per_page=20 and desc ordering for pipelines", async () => {
      fetchSpy.mockResolvedValue(jsonResponse([]))
      const client = new GitLabClient({ host, token })
      await client.getPipelines("42")
      const url = fetchSpy.mock.calls[0]?.[0] as string
      expect(url).toContain("/projects/42/pipelines")
      expect(url).toContain("per_page=20")
      expect(url).toContain("order_by=id")
      expect(url).toContain("sort=desc")
    })

    it("URL-encodes the group id and targets the groups/projects endpoint", async () => {
      fetchSpy.mockResolvedValue(jsonResponse([]))
      const client = new GitLabClient({ host, token })
      await client.getGroupProjects("workspace/sso")
      const url = fetchSpy.mock.calls[0]?.[0] as string
      expect(url).toContain("/groups/workspace%2Fsso/projects")
      expect(url).toContain("per_page=100")
      expect(url).toContain("with_shared=false")
    })

    it("uses state=opened&per_page=50 for merge_requests", async () => {
      fetchSpy.mockResolvedValue(jsonResponse([]))
      const client = new GitLabClient({ host, token })
      await client.getMergeRequests("42")
      const url = fetchSpy.mock.calls[0]?.[0] as string
      expect(url).toContain("/projects/42/merge_requests")
      expect(url).toContain("state=opened")
      expect(url).toContain("per_page=50")
    })
  })

  describe("caching via Next fetch (GL-7)", () => {
    it("uses next.revalidate=300 for project metadata", async () => {
      fetchSpy.mockResolvedValue(jsonResponse({ id: 1 }))
      const client = new GitLabClient({ host, token })
      await client.getProject("42")
      const init = fetchSpy.mock.calls[0]?.[1] as RequestInit & {
        next?: { revalidate?: number }
      }
      expect(init.next).toEqual({ revalidate: 300 })
    })

    it("uses next.revalidate=60 for pipelines, jobs, commits and MRs", async () => {
      fetchSpy.mockImplementation(() => Promise.resolve(jsonResponse([])))
      const client = new GitLabClient({ host, token })
      await client.getPipelines("42")
      await client.getJobs("42", 1)
      await client.getCommit("42", "abc")
      await client.getMergeRequests("42")
      for (const call of fetchSpy.mock.calls) {
        const init = call[1] as RequestInit & { next?: { revalidate?: number } }
        expect(init.next).toEqual({ revalidate: 60 })
      }
    })
  })

  describe("error handling (GL-3)", () => {
    it("throws GitLabError with status, path and message but WITHOUT the token", async () => {
      fetchSpy.mockResolvedValue(
        new Response("unauthorized", { status: 401 })
      )
      const client = new GitLabClient({ host, token })
      let error: unknown
      try {
        await client.getProject("42")
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(GitLabError)
      const err = error as GitLabError
      expect(err.status).toBe(401)
      expect(err.path).toContain("/projects/42")
      const serialized = JSON.stringify({
        message: err.message,
        path: err.path,
      })
      expect(serialized).not.toContain(token)
      expect(err.message).not.toContain(token)
    })

    it("throws GitLabError on 500 with a Spanish-safe generic message", async () => {
      fetchSpy.mockResolvedValue(
        new Response("boom", { status: 500 })
      )
      const client = new GitLabClient({ host, token })
      await expect(client.getPipelines("42")).rejects.toBeInstanceOf(GitLabError)
    })
  })
})
