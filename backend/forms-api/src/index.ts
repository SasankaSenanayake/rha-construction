import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { getConfig } from "./config";
import { DynamoDbSubmissionRepository } from "./repository/dynamodb-submission-repository";
import { SesMailer } from "./email/ses-mailer";
import { handleContactSubmission } from "./handlers/contact";
import { handleQuoteSubmission } from "./handlers/quote";
import { internalError, notFound } from "./response";

// Constructed once per execution environment and reused across warm invocations.
let repository: DynamoDbSubmissionRepository | undefined;
let mailer: SesMailer | undefined;

function getRepository(): DynamoDbSubmissionRepository {
  if (!repository) {
    repository = new DynamoDbSubmissionRepository(getConfig().tableName);
  }
  return repository;
}

function getMailer(): SesMailer {
  if (!mailer) {
    mailer = new SesMailer(getConfig().sesFromAddress);
  }
  return mailer;
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    switch (event.routeKey) {
      case "POST /contact":
        return await handleContactSubmission(event, getRepository(), getMailer());
      case "POST /quote":
        return await handleQuoteSubmission(event, getRepository(), getMailer());
      default:
        return notFound();
    }
  } catch (error) {
    console.error("Unhandled error in forms-api handler", error);
    return internalError();
  }
}
