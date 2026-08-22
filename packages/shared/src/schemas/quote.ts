import { z } from "zod";
import { emailSchema, honeypotSchema, nameSchema, phoneSchema } from "./common";
import { localeSchema } from "./locale";

export const PROJECT_TYPES = [
  "residential",
  "commercial",
  "renovation",
  "interior-finishing",
  "project-management",
] as const;

export const BUDGET_RANGES = [
  "under-2m",
  "2m-5m",
  "5m-10m",
  "10m-25m",
  "over-25m",
  "not-sure",
] as const;

export const CONTACT_METHODS = ["phone", "email", "whatsapp"] as const;

export const quoteSubmissionSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  propertyLocation: z
    .string()
    .trim()
    .min(2, { message: "Location must be at least 2 characters" })
    .max(200),
  projectType: z.enum(PROJECT_TYPES),
  estimatedBudgetRange: z.enum(BUDGET_RANGES),
  preferredContactMethod: z.enum(CONTACT_METHODS),
  projectScopeNotes: z
    .string()
    .trim()
    .min(10, { message: "Please describe your project in at least 10 characters" })
    .max(2000),
  desiredStartDate: z.string().trim().optional().or(z.literal("")),
  locale: localeSchema,
  companyWebsite: honeypotSchema,
});

export type QuoteSubmissionInput = z.infer<typeof quoteSubmissionSchema>;
