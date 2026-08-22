import { z } from "zod";
import { emailSchema, honeypotSchema, nameSchema, phoneSchema } from "./common";
import { localeSchema } from "./locale";

export const contactSubmissionSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be under 2000 characters" }),
  locale: localeSchema,
  companyWebsite: honeypotSchema,
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
