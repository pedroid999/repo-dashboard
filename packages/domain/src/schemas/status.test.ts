import { describe, it, expect } from "vitest"

import { CiStatus, Stage, Status } from "@workspace/domain/schemas/status"

describe("Status", () => {
  it("accepts 'passed' / 'failed' / 'running'", () => {
    expect(Status.safeParse("passed").success).toBe(true)
    expect(Status.safeParse("failed").success).toBe(true)
    expect(Status.safeParse("running").success).toBe(true)
  })

  it("rejects unknown values", () => {
    expect(Status.safeParse("exploded").success).toBe(false)
    expect(Status.safeParse("").success).toBe(false)
    expect(Status.safeParse(undefined).success).toBe(false)
  })
})

describe("Stage", () => {
  it("accepts 'ok' / 'fail' / 'run' / 'skip'", () => {
    expect(Stage.safeParse("ok").success).toBe(true)
    expect(Stage.safeParse("fail").success).toBe(true)
    expect(Stage.safeParse("run").success).toBe(true)
    expect(Stage.safeParse("skip").success).toBe(true)
  })

  it("rejects values from other enums", () => {
    expect(Stage.safeParse("passed").success).toBe(false)
    expect(Stage.safeParse("invalid").success).toBe(false)
  })
})

describe("CiStatus", () => {
  it("accepts 'ok' / 'fail' / 'run'", () => {
    expect(CiStatus.safeParse("ok").success).toBe(true)
    expect(CiStatus.safeParse("fail").success).toBe(true)
    expect(CiStatus.safeParse("run").success).toBe(true)
  })

  it("rejects stage-only and pipeline-only values", () => {
    expect(CiStatus.safeParse("skip").success).toBe(false)
    expect(CiStatus.safeParse("passed").success).toBe(false)
  })
})
