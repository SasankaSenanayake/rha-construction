import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { HONEYPOT_FIELD_NAME, quoteSubmissionSchema } from "@rha/shared";
import { getConfig } from "../config";
import { quoteNotificationEmail } from "../email/templates";
import type { SubmissionRepository } from "../repository/submission-repository.interface";
import type { Mailer } from "../email/mailer.interface";
import { internalError, spamRejected, success, validationError } from "../response";

export async function handleQuoteSubmission(
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

  const parsed = quoteSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { companyWebsite: _honeypot, ...input } = parsed.data;
  const submissionId = randomUUID();
  const createdAt = new Date().toISOString();
  const sourceIp = event.requestContext.http.sourceIp;

  const record = { kind: "QUOTE" as const, ...input, submissionId, createdAt, sourceIp };

  try {
    await repository.save(record);
  } catch (error) {
    console.error("Failed to persist quote submission", error);
    return internalError();
  }

  try {
    const config = getConfig();
    await mailer.send(config.sesToAddress, quoteNotificationEmail(record));
  } catch (error) {
    console.error("Failed to send quote notification email", error);
  }

  return success(submissionId);
}
