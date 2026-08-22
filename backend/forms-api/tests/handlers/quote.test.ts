import { describe, expect, it } from "vitest";
import { handleQuoteSubmission } from "../../src/handlers/quote";
import { makeEvent, makeMockMailer, makeMockRepository } from "../test-helpers";

const validBody = {
  name: "Nimali Fernando",
  email: "nimali@example.com",
  phone: "+94771234567",
  propertyLocation: "Nugegoda, Colombo",
  projectType: "residential",
  estimatedBudgetRange: "5m-10m",
  preferredContactMethod: "whatsapp",
  projectScopeNotes: "Looking to build a two-story house on a 10 perch land.",
  desiredStartDate: "2026-10-01",
  locale: "si",
  companyWebsite: "",
};

describe("handleQuoteSubmission", () => {
  it("returns 200 and a submissionId for a valid payload", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleQuoteSubmission(makeEvent("POST /quote", validBody), repository, mailer);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.success).toBe(true);
    expect(repository.save).toHaveBeenCalledTimes(1);

    const savedRecord = repository.save.mock.calls[0]![0];
    expect(savedRecord.kind).toBe("QUOTE");
    expect(savedRecord.projectType).toBe("residential");
  });

  it("returns 422 when phone is missing (required for quote requests)", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleQuoteSubmission(
      makeEvent("POST /quote", { ...validBody, phone: "" }),
      repository,
      mailer,
    );

    expect(result.statusCode).toBe(422);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("returns 422 for an invalid projectType", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleQuoteSubmission(
      makeEvent("POST /quote", { ...validBody, projectType: "landscaping" }),
      repository,
      mailer,
    );

    expect(result.statusCode).toBe(422);
  });

  it("rejects a honeypot-filled submission", async () => {
    const repository = makeMockRepository();
    const mailer = makeMockMailer();
    const result = await handleQuoteSubmission(
      makeEvent("POST /quote", { ...validBody, companyWebsite: "spam" }),
      repository,
      mailer,
    );

    expect(result.statusCode).toBe(422);
    const body = JSON.parse(result.body as string);
    expect(body.error.code).toBe("SPAM_REJECTED");
    expect(repository.save).not.toHaveBeenCalled();
  });
});
