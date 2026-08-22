import type { SubmissionRecord } from "./types";

/**
 * Storage-agnostic persistence boundary for form submissions.
 * DynamoDbSubmissionRepository is the only implementation today; a future
 * Postgres-backed implementation only needs to satisfy this interface —
 * handler code never changes.
 */
export interface SubmissionRepository {
  save(record: SubmissionRecord): Promise<void>;
}
