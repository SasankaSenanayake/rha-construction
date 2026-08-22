import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "si", "ta"] as const;

export const localeSchema = z.enum(SUPPORTED_LOCALES);

export type Locale = z.infer<typeof localeSchema>;
