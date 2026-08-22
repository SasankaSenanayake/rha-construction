import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { contactSubmissionSchema, HONEYPOT_FIELD_NAME } from "@rha/shared";
import { getConfig } from "../config";
import { contactNotificationEmail } from "../email/templates";
import type { SubmissionRepository } from "../repository/submission-repository.interface";
import type { Mailer } from "../email/mailer.interface";
import { internalError, spamRejected, success, validationError } from "../response";

export async function handleContactSubmission(
  event: APIGatewayProxyEventV2,
  repository: SubmissionRepository,
  mailer: Mailer,
): Promise<APIGatewayProxyStructuredResultV2> {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return validationError({ body: ["Request body must be valid JSON"] });
  }

  if (typeof payload[HONEYPOT_FIELD_NAME] === "string" && payload[HONEYPOT_FIELD_NAME].length > 0) {
    return spamRejected();
  }

  const parsed = contactSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { companyWebsite: _honeypot, ...input } = parsed.data;
  const submissionId = randomUUID();
  const createdAt = new Date().toISOString();
  const sourceIp = event.requestContext.http.sourceIp;

  const record = { kind: "CONTACT" as const, ...input, submissionId, createdAt, sourceIp };

  try {
    await repository.save(record);
  } catch (error) {
    console.error("Failed to persist contact submission", error);
    return internalError();
  }

  try {
    const config = getConfig();
    await mailer.send(config.sesToAddress, contactNotificationEmail(record));
  } catch (error) {
    // The lead is already durably stored; a notification-email failure
    // should not block the submitter or force a resubmission.
    console.error("Failed to send contact notification email", error);
  }

  return success(submissionId);
}
