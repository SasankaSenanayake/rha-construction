import { describe, expect, it } from "vitest";
import { quoteSubmissionSchema } from "../src/schemas/quote";

const validPayload = {
  name: "Nimali Fernando",
  email: "nimali@example.com",
  phone: "+94771234567",
  propertyLocation: "Nugegoda, Colombo",
  projectType: "residential" as const,
  estimatedBudgetRange: "5m-10m" as const,
  preferredContactMethod: "whatsapp" as const,
  projectScopeNotes: "Looking to build a two-story house on a 10 perch land.",
  desiredStartDate: "2026-10-01",
  locale: "si" as const,
  companyWebsite: "",
};

describe("quoteSubmissionSchema", () => {
  it("accepts a valid payload", () => {
    const result = quoteSubmissionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts an omitted optional desiredStartDate", () => {
    const { desiredStartDate: _omit, ...rest } = validPayload;
    const result = quoteSubmissionSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("requires a phone number (unlike contact form)", () => {
    const result = quoteSubmissionSchema.safeParse({ ...validPayload, phone: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid projectType", () => {
    const result = quoteSubmissionSchema.safeParse({ ...validPayload, projectType: "landscaping" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid estimatedBudgetRange", () => {
    const result = quoteSubmissionSchema.safeParse({ ...validPayload, estimatedBudgetRange: "free" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid preferredContactMethod", () => {
    const result = quoteSubmissionSchema.safeParse({ ...validPayload, preferredContactMethod: "carrier-pigeon" });
    expect(result.success).toBe(false);
  });

  it("rejects a filled-in honeypot field (bot submission)", () => {
    const result = quoteSubmissionSchema.safeParse({ ...validPayload, companyWebsite: "spam" });
    expect(result.success).toBe(false);
  });
});
