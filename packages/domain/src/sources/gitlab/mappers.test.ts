import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { Pipeline } from "@workspace/domain/schemas/pipeline"
import { MergeRequest } from "@workspace/domain/schemas/mr"
import * as logModule from "@workspace/domain/sources/gitlab/log"
import {
  formatAge,
  formatDur,
  mapApprovals,
  mapCommit,
  mapMrCi,
  mapMrDays,
  mapMrReviewers,
  mapPipelineStatus,
  mapStages,
  mapTitle,
  mapPipeline,
  mapMergeRequest,
} from "@workspace/domain/sources/gitlab/mappers"

describe("gitlab mappers (GL-5, GL-6)", () => {
  describe("mapPipelineStatus", () => {
    it("collapses success → passed", () => {
      expect(mapPipelineStatus("success")).toBe("passed")
    })

    it("collapses failed → failed", () => {
      expect(mapPipelineStatus("failed")).toBe("failed")
    })

    it("collapses canceled → failed", () => {
      expect(mapPipelineStatus("canceled")).toBe("failed")
    })

    it("collapses running → running", () => {
      expect(mapPipelineStatus("running")).toBe("running")
    })

    it("collapses pending → running", () => {
      expect(mapPipelineStatus("pending")).toBe("running")
    })

    it("collapses preparing → running", () => {
      expect(mapPipelineStatus("preparing")).toBe("running")
    })
  })

  describe("mapPipelineStatus — unknown status warns", () => {
    const warnSpy = vi.spyOn(logModule, "warn").mockImplementation(() => {})

    beforeEach(() => {
      warnSpy.mockClear()
    })

    afterEach(() => {
      warnSpy.mockClear()
    })

    it('coerces "manual" → "running" and emits a warn referencing "manual"', () => {
      const result = mapPipelineStatus("manual")
      expect(result).toBe("running")
      expect(warnSpy).toHaveBeenCalledTimes(1)
      const call = warnSpy.mock.calls[0]?.[0]
      expect(call).toMatchObject({ op: "map.pipeline.status" })
      expect(JSON.stringify(call)).toContain("manual")
    })
  })

  describe("mapStages", () => {
    it("groups jobs by stage and collapses to ok|fail|run|skip", () => {
      const jobs = [
        { id: 1, name: "build", stage: "build", status: "success" },
        { id: 2, name: "lint", stage: "build", status: "success" },
        { id: 3, name: "unit", stage: "test", status: "success" },
        { id: 4, name: "integration", stage: "test", status: "failed" },
        { id: 5, name: "deploy", stage: "deploy", status: "skipped" },
      ]
      expect(mapStages(jobs)).toEqual(["ok", "fail", "skip"])
    })

    it("marks a stage as 'run' when any job is running/pending", () => {
      const jobs = [
        { id: 1, name: "build", stage: "build", status: "success" },
        { id: 2, name: "unit", stage: "test", status: "running" },
      ]
      expect(mapStages(jobs)).toEqual(["ok", "run"])
    })

    it("preserves first-seen order of stages", () => {
      const jobs = [
        { id: 1, name: "deploy", stage: "deploy", status: "skipped" },
        { id: 2, name: "build", stage: "build", status: "success" },
      ]
      expect(mapStages(jobs)).toEqual(["skip", "ok"])
    })
  })

  describe("formatDur", () => {
    it("formats 3725 seconds as 01:02:05", () => {
      expect(formatDur(3725)).toBe("01:02:05")
    })

    it("formats 0 seconds as 00:00:00", () => {
      expect(formatDur(0)).toBe("00:00:00")
    })

    it("formats 59 seconds as 00:00:59", () => {
      expect(formatDur(59)).toBe("00:00:59")
    })

    it("treats null/undefined as 00:00:00", () => {
      expect(formatDur(null)).toBe("00:00:00")
      expect(formatDur(undefined)).toBe("00:00:00")
    })
  })

  describe("formatAge", () => {
    const NOW = new Date("2026-04-19T12:00:00.000Z").getTime()

    it("formats <1h as Xm", () => {
      const createdAt = new Date(NOW - 12 * 60_000).toISOString()
      expect(formatAge(createdAt, NOW)).toBe("12m")
    })

    it("formats <1d as Xh", () => {
      const createdAt = new Date(NOW - 3 * 3_600_000).toISOString()
      expect(formatAge(createdAt, NOW)).toBe("3h")
    })

    it("formats >=1d as Xd", () => {
      const createdAt = new Date(NOW - 2 * 86_400_000).toISOString()
      expect(formatAge(createdAt, NOW)).toBe("2d")
    })

    it("floors minutes to 0m when created within the same minute", () => {
      expect(formatAge(new Date(NOW - 15_000).toISOString(), NOW)).toBe("0m")
    })
  })

  describe("mapCommit", () => {
    it("slices sha to 8 chars", () => {
      expect(mapCommit("9c02fd00abcdef12")).toBe("9c02fd00")
    })

    it("returns full short sha when input is already short", () => {
      expect(mapCommit("abc")).toBe("abc")
    })
  })

  describe("mapTitle", () => {
    it("returns commit.title verbatim", () => {
      expect(
        mapTitle({ id: "x", short_id: "x", title: "fix: ttl", author_name: "a" })
      ).toBe("fix: ttl")
    })

    it("returns empty string when commit is undefined", () => {
      expect(mapTitle(undefined)).toBe("")
    })
  })

  describe("mapMrCi", () => {
    const warnSpy = vi.spyOn(logModule, "warn").mockImplementation(() => {})

    beforeEach(() => warnSpy.mockClear())

    it("collapses success → ok", () => {
      expect(mapMrCi({ status: "success" })).toBe("ok")
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it("collapses failed/canceled → fail", () => {
      expect(mapMrCi({ status: "failed" })).toBe("fail")
      expect(mapMrCi({ status: "canceled" })).toBe("fail")
    })

    it("collapses running/pending → run", () => {
      expect(mapMrCi({ status: "running" })).toBe("run")
      expect(mapMrCi({ status: "pending" })).toBe("run")
    })

    it("returns 'run' and warns when head_pipeline is null", () => {
      const result = mapMrCi(null)
      expect(result).toBe("run")
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0]?.[0]).toMatchObject({
        op: "map.mr.ci",
        reason: "no head_pipeline",
      })
    })
  })

  describe("mapApprovals", () => {
    it('formats "${required-left}/${required}"', () => {
      expect(mapApprovals(2, 1)).toBe("1/2")
    })

    it("formats 0/0 when nothing required", () => {
      expect(mapApprovals(0, 0)).toBe("0/0")
    })

    it("formats full approvals as 2/2", () => {
      expect(mapApprovals(2, 0)).toBe("2/2")
    })
  })

  describe("mapMrReviewers", () => {
    it("maps reviewers to username list", () => {
      expect(
        mapMrReviewers([{ username: "ada" }, { username: "linus" }])
      ).toEqual(["ada", "linus"])
    })

    it("returns empty array when reviewers is absent", () => {
      expect(mapMrReviewers(undefined)).toEqual([])
    })

    it("returns empty array when reviewers is empty", () => {
      expect(mapMrReviewers([])).toEqual([])
    })
  })

  describe("mapMrDays", () => {
    const NOW = new Date("2026-04-19T12:00:00.000Z").getTime()

    it("returns days since created_at", () => {
      const createdAt = new Date(NOW - 4 * 86_400_000).toISOString()
      expect(mapMrDays(createdAt, NOW)).toBe(4)
    })

    it("returns 0 when created_at is today", () => {
      expect(mapMrDays(new Date(NOW - 3_600_000).toISOString(), NOW)).toBe(0)
    })
  })

  describe("mapPipeline (full record)", () => {
    it("produces a valid Pipeline from GitLab pipeline + jobs + commit", () => {
      const NOW = new Date("2026-04-19T12:00:00.000Z").getTime()
      const pipeline = {
        id: 98132,
        sha: "9c02fd00abcdef1234567890",
        ref: "main",
        status: "success",
        duration: 3725,
        created_at: new Date(NOW - 12 * 60_000).toISOString(),
        user: { username: "noa" },
      }
      const jobs = [
        { id: 1, name: "build", stage: "build", status: "success" },
        { id: 2, name: "unit", stage: "test", status: "success" },
      ]
      const commit = {
        id: pipeline.sha,
        short_id: "9c02fd00",
        title: "fix(auth): refresh",
        author_name: "noa",
      }
      const result = mapPipeline(pipeline, jobs, commit, NOW)
      expect(Pipeline.safeParse(result).success).toBe(true)
      expect(result).toEqual({
        branch: "main",
        id: 98132,
        status: "passed",
        dur: "01:02:05",
        age: "12m",
        author: "noa",
        commit: "9c02fd00",
        title: "fix(auth): refresh",
        stages: ["ok", "ok"],
      })
    })
  })

  describe("mapMergeRequest (full record)", () => {
    it("produces a valid MergeRequest and NEVER writes stale", () => {
      const NOW = new Date("2026-04-19T12:00:00.000Z").getTime()
      const raw = {
        iid: 312,
        title: "feat(mfa): backup codes",
        author: { username: "sara" },
        source_branch: "feat/x",
        target_branch: "develop",
        reviewers: [{ username: "noa" }],
        head_pipeline: { status: "success" },
        created_at: new Date(NOW - 2 * 86_400_000).toISOString(),
        has_conflicts: true,
      }
      const result = mapMergeRequest("auth-service", raw, {
        approvals_required: 2,
        approvals_left: 1,
      }, NOW)
      expect(MergeRequest.safeParse(result).success).toBe(true)
      expect(result).toEqual({
        repo: "auth-service",
        id: 312,
        title: "feat(mfa): backup codes",
        author: "sara",
        from: "feat/x",
        to: "develop",
        reviewers: ["noa"],
        ci: "ok",
        days: 2,
        approvals: "1/2",
        conflicts: true,
      })
      expect(result.stale).toBeUndefined()
      expect("stale" in result).toBe(false)
    })

    it("omits conflicts when GitLab reports has_conflicts=false", () => {
      const raw = {
        iid: 1,
        title: "t",
        author: { username: "a" },
        source_branch: "x",
        target_branch: "y",
        reviewers: [],
        head_pipeline: { status: "success" },
        created_at: new Date().toISOString(),
        has_conflicts: false,
      }
      const result = mapMergeRequest("r", raw, {
        approvals_required: 1,
        approvals_left: 1,
      })
      expect("conflicts" in result).toBe(false)
      expect(result.stale).toBeUndefined()
    })
  })
})
