import type { ContactSubmissionInput, QuoteSubmissionInput } from "@rha/shared";

export interface ContactSubmissionRecord extends Omit<ContactSubmissionInput, "companyWebsite"> {
  submissionId: string;
  createdAt: string;
  sourceIp?: string;
}

export interface QuoteSubmissionRecord extends Omit<QuoteSubmissionInput, "companyWebsite"> {
  submissionId: string;
  createdAt: string;
  sourceIp?: string;
}

export type SubmissionRecord =
  | ({ kind: "CONTACT" } & ContactSubmissionRecord)
  | ({ kind: "QUOTE" } & QuoteSubmissionRecord);
