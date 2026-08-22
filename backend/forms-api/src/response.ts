import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import type { ApiErrorResponse, ApiSuccessResponse } from "@rha/shared";

export function success(submissionId: string): APIGatewayProxyStructuredResultV2 {
  const body: ApiSuccessResponse = { success: true, submissionId };
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function validationError(fieldErrors: Record<string, string[]>): APIGatewayProxyStructuredResultV2 {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "One or more fields are invalid.",
      fieldErrors,
    },
  };
  return {
    statusCode: 422,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function spamRejected(): APIGatewayProxyStructuredResultV2 {
  const body: ApiErrorResponse = {
    success: false,
    error: { code: "SPAM_REJECTED", message: "Submission rejected." },
  };
  return {
    statusCode: 422,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function internalError(): APIGatewayProxyStructuredResultV2 {
  const body: ApiErrorResponse = {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again later." },
  };
  return {
    statusCode: 500,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function notFound(): APIGatewayProxyStructuredResultV2 {
  const body: ApiErrorResponse = {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Not found." },
  };
  return {
    statusCode: 404,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
