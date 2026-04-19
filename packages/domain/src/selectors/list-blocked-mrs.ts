import type { MergeRequest } from "@workspace/domain/schemas/mr"

export function listBlockedMrs(mrs: MergeRequest[]): MergeRequest[] {
  return mrs.filter((mr) => mr.ci === "fail" || mr.conflicts === true)
}
