import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { vi } from "vitest";
import type { SubmissionRepository } from "../src/repository/submission-repository.interface";
import type { Mailer } from "../src/email/mailer.interface";

export function makeEvent(routeKey: string, body: unknown): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey,
    rawPath: "/",
    rawQueryString: "",
    headers: { "content-type": "application/json" },
    requestContext: {
      accountId: "123456789012",
      apiId: "test-api",
      domainName: "test-api.execute-api.eu-west-1.amazonaws.com",
      domainPrefix: "test-api",
      http: {
        method: "POST",
        path: "/",
        protocol: "HTTP/1.1",
        sourceIp: "203.0.113.10",
        userAgent: "vitest",
      },
      requestId: "test-request-id",
      routeKey,
      stage: "$default",
      time: new Date().toISOString(),
      timeEpoch: Date.now(),
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  } as APIGatewayProxyEventV2;
}

export function makeMockRepository(): SubmissionRepository & { save: ReturnType<typeof vi.fn> } {
  return { save: vi.fn().mockResolvedValue(undefined) };
}

export function makeMockMailer(): Mailer & { send: ReturnType<typeof vi.fn> } {
  return { send: vi.fn().mockResolvedValue(undefined) };
}
