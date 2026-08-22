import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { SubmissionRepository } from "./submission-repository.interface";
import type { SubmissionRecord } from "./types";

const SUBMISSION_TTL_SECONDS = 60 * 60 * 24 * 730; // ~2 years

export class DynamoDbSubmissionRepository implements SubmissionRepository {
  private readonly doc: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string, client: DynamoDBClient = new DynamoDBClient({})) {
    this.tableName = tableName;
    this.doc = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  async save(record: SubmissionRecord): Promise<void> {
    const ttl = Math.floor(Date.now() / 1000) + SUBMISSION_TTL_SECONDS;

    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          pk: record.kind,
          sk: `${record.createdAt}#${record.submissionId}`,
          status: "NEW",
          ttl,
          ...record,
        },
      }),
    );
  }
}
