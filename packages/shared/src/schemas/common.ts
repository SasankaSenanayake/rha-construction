import { z } from "zod";

/**
 * Honeypot field name shared by the web form and the Lambda handler.
 * Any non-empty value here means the submission is bot traffic.
 */
export const HONEYPOT_FIELD_NAME = "companyWebsite";

export const honeypotSchema = z
  .string()
  .max(0, { message: "Spam check failed" })
  .optional()
  .or(z.literal(""));

// Loose international phone validation — diaspora clients may submit
// non-Sri-Lankan numbers, so this only enforces a sane digit count/shape.
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s-]{6,17}[0-9]$/, {
    message: "Enter a valid phone number",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(100, { message: "Name must be under 100 characters" });

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Enter a valid email address" })
  .max(254);
