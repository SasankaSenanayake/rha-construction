import { describe, expect, it } from "vitest";
import { contactSubmissionSchema } from "../src/schemas/contact";

const validPayload = {
  name: "Kasun Perera",
  email: "kasun@example.com",
  phone: "+94 77 123 4567",
  message: "I'd like to ask about your residential construction services.",
  locale: "en" as const,
  companyWebsite: "",
};

describe("contactSubmissionSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSubmissionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts an empty optional phone", () => {
    const result = contactSubmissionSchema.safeParse({ ...validPayload, phone: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = contactSubmissionSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSubmissionSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactSubmissionSchema.safeParse({ ...validPayload, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported locale", () => {
    const result = contactSubmissionSchema.safeParse({ ...validPayload, locale: "fr" });
    expect(result.success).toBe(false);
  });

  it("rejects a filled-in honeypot field (bot submission)", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validPayload,
      companyWebsite: "http://spambot.example",
    });
    expect(result.success).toBe(false);
  });

  it("produces field-level errors for multiple invalid fields", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validPayload,
      name: "",
      email: "bad",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.name).toBeDefined();
      expect(fieldErrors.email).toBeDefined();
    }
  });
});
