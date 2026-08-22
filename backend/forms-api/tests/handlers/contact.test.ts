import { describe, expect, it } from "vitest";
import { handleContactSubmission } from "../../src/handlers/contact";
import { makeEvent, makeMockMailer, makeMockRepository } from "../test-helpers";

const validBody = {
  name: "Kasun Perera",
  email: "kasun@example.com",
  phone: "+94771234567",
  message: "I'd like to ask about your residential construction services.",
  locale: "en",
  companyWebsite: "",
};

describe("handleContactSubmission", () => {
  it("returns 200 and a submissionId for a valid payload", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleContactSubmission(makeEvent("POST /contact", validBody), repository, mailer);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.success).toBe(true);
    expect(typeof body.submissionId).toBe("string");
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });

  it("persists a record with kind CONTACT and the source IP", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    await handleContactSubmission(makeEvent("POST /contact", validBody), repository, mailer);

    const savedRecord = repository.save.mock.calls[0]![0];
    expect(savedRecord.kind).toBe("CONTACT");
    expect(savedRecord.sourceIp).toBe("203.0.113.10");
    expect(savedRecord.email).toBe(validBody.email);
  });

  it("returns 422 with field errors for an invalid payload", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleContactSubmission(
      makeEvent("POST /contact", { ...validBody, email: "not-an-email" }),
      repository,
      mailer,
    );

    expect(result.statusCode).toBe(422);
    const body = JSON.parse(result.body as string);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.fieldErrors.email).toBeDefined();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("rejects a honeypot-filled submission without touching the repository", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleContactSubmission(
      makeEvent("POST /contact", { ...validBody, companyWebsite: "http://spambot.example" }),
      repository,
      mailer,
    );

    expect(result.statusCode).toBe(422);
    const body = JSON.parse(result.body as string);
    expect(body.error.code).toBe("SPAM_REJECTED");
    expect(repository.save).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("still returns success if the notification email fails to send", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    mailer.send.mockRejectedValueOnce(new Error("SES is down"));

    const result = await handleContactSubmission(makeEvent("POST /contact", validBody), repository, mailer);

    expect(result.statusCode).toBe(200);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it("returns 500 if persisting the submission fails", async () => {
    const repository = makeMockRepository();
    repository.save.mockRejectedValueOnce(new Error("DynamoDB is down"));
    const mailer = makeMockMailer();

    const result = await handleContactSubmission(makeEvent("POST /contact", validBody), repository, mailer);

    expect(result.statusCode).toBe(500);
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("returns 422 for a malformed JSON body", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const event = makeEvent("POST /contact", {});
    event.body = "{not json";

    const result = await handleContactSubmission(event, repository, mailer);
    expect(result.statusCode).toBe(422);
  });
});
