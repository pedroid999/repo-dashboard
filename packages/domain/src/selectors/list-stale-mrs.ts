import type { MergeRequest } from "@workspace/domain/schemas/mr"
import { STALE_DAYS_THRESHOLD } from "@workspace/domain/selectors/constants"

export function listStaleMrs(mrs: MergeRequest[]): MergeRequest[] {
  return mrs.filter((mr) => mr.stale === true || mr.days > STALE_DAYS_THRESHOLD)
}
