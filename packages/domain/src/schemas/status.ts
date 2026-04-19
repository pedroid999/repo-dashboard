import { z } from "zod"

export const Status = z.enum(["passed", "failed", "running"])
export type Status = z.infer<typeof Status>

export const Stage = z.enum(["ok", "fail", "run", "skip"])
export type Stage = z.infer<typeof Stage>

export const CiStatus = z.enum(["ok", "fail", "run"])
export type CiStatus = z.infer<typeof CiStatus>
