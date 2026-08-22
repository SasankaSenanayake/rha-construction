import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { handler } from "../src/index";
import { makeEvent } from "./test-helpers";

const ddbMock = mockClient(DynamoDBDocumentClient);
const sesMock = mockClient(SESClient);

beforeEach(() => {
  ddbMock.reset();
  sesMock.reset();
  ddbMock.on(PutCommand).resolves({});
  sesMock.on(SendEmailCommand).resolves({ MessageId: "test-message-id" });
});

describe("handler routing", () => {
  it("routes POST /contact to the contact handler", async () => {
    const result = await handler(
      makeEvent("POST /contact", {
        name: "Kasun Perera",
        email: "kasun@example.com",
        phone: "",
        message: "Interested in a quote for a new roof.",
        locale: "en",
        companyWebsite: "",
      }),
    );
    expect(result.statusCode).toBe(200);
  });

  it("routes POST /quote to the quote handler", async () => {
    const result = await handler(
      makeEvent("POST /quote", {
        name: "Nimali Fernando",
        email: "nimali@example.com",
        phone: "+94771234567",
        propertyLocation: "Kandy",
        projectType: "commercial",
        estimatedBudgetRange: "over-25m",
        preferredContactMethod: "email",
        projectScopeNotes: "New warehouse construction, approx 15,000 sq ft.",
        locale: "ta",
        companyWebsite: "",
      }),
    );
    expect(result.statusCode).toBe(200);
  });

  it("returns 404 for an unknown route", async () => {
    const result = await handler(makeEvent("GET /unknown", {}));
    expect(result.statusCode).toBe(404);
  });
});
