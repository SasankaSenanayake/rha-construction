import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { DynamoDbSubmissionRepository } from "../../src/repository/dynamodb-submission-repository";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("DynamoDbSubmissionRepository", () => {
  it("writes a PutCommand with pk/sk derived from kind and createdAt", async () => {
    ddbMock.on(PutCommand).resolves({});
    const client = new DynamoDBClient({ region: "eu-west-1" });
    const repository = new DynamoDbSubmissionRepository("test-table", client);

    await repository.save({
      kind: "CONTACT",
      submissionId: "sub-123",
      createdAt: "2026-08-22T10:00:00.000Z",
      name: "Kasun Perera",
      email: "kasun@example.com",
      phone: "",
      message: "Hello",
      locale: "en",
    });

    const calls = ddbMock.commandCalls(PutCommand);
    expect(calls).toHaveLength(1);
    const item = calls[0]!.args[0].input.Item as Record<string, unknown>;
    expect(item.pk).toBe("CONTACT");
    expect(item.sk).toBe("2026-08-22T10:00:00.000Z#sub-123");
    expect(item.status).toBe("NEW");
    expect(item.ttl).toBeGreaterThan(Math.floor(Date.now() / 1000));
    expect(item.email).toBe("kasun@example.com");
  });

  it("propagates errors from the underlying client", async () => {
    ddbMock.on(PutCommand).rejects(new Error("throughput exceeded"));
    const repository = new DynamoDbSubmissionRepository("test-table", new DynamoDBClient({}));

    await expect(
      repository.save({
        kind: "QUOTE",
        submissionId: "sub-456",
        createdAt: "2026-08-22T10:00:00.000Z",
        name: "Nimali Fernando",
        email: "nimali@example.com",
        phone: "+94771234567",
        propertyLocation: "Kandy",
        projectType: "residential",
        estimatedBudgetRange: "5m-10m",
        preferredContactMethod: "phone",
        projectScopeNotes: "New house",
        locale: "si",
      }),
    ).rejects.toThrow("throughput exceeded");
  });
});
