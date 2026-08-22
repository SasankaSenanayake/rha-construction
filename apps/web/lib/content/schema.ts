import { z } from "zod";
import { PROJECT_TYPES } from "@rha/shared";

const localizedString = z.object({
  en: z.string().min(1),
  si: z.string().min(1),
  ta: z.string().min(1),
});

export const projectImageSchema = z.object({
  src: z.string().startsWith("/images/"),
  alt: localizedString,
});

export const projectSchema = z.object({
  slug: z.string().min(1),
  category: z.enum(PROJECT_TYPES),
  location: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean().default(false),
  images: z.array(projectImageSchema).min(1),
  translations: z.object({
    en: z.object({ title: z.string().min(1), summary: z.string().min(1), bodyMd: z.string().min(1) }),
    si: z.object({ title: z.string().min(1), summary: z.string().min(1), bodyMd: z.string().min(1) }),
    ta: z.object({ title: z.string().min(1), summary: z.string().min(1), bodyMd: z.string().min(1) }),
  }),
});

export const serviceSchema = z.object({
  slug: z.enum(PROJECT_TYPES),
  icon: z.string().min(1),
  order: z.number().int(),
  translations: z.object({
    en: z.object({
      title: z.string().min(1),
      shortDescription: z.string().min(1),
      processSteps: z.array(z.string().min(1)).min(1),
      gallery: z.array(projectImageSchema).default([]),
    }),
    si: z.object({
      title: z.string().min(1),
      shortDescription: z.string().min(1),
      processSteps: z.array(z.string().min(1)).min(1),
      gallery: z.array(projectImageSchema).default([]),
    }),
    ta: z.object({
      title: z.string().min(1),
      shortDescription: z.string().min(1),
      processSteps: z.array(z.string().min(1)).min(1),
      gallery: z.array(projectImageSchema).default([]),
    }),
  }),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  clientName: z.string().min(1),
  projectSlug: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  translations: z.object({
    en: z.object({ quote: z.string().min(1) }),
    si: z.object({ quote: z.string().min(1) }),
    ta: z.object({ quote: z.string().min(1) }),
  }),
});

export const ARTICLE_CATEGORIES = ["guides", "renovation", "materials"] as const;

export const articleSchema = z.object({
  slug: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(ARTICLE_CATEGORIES),
  translations: z.object({
    en: z.object({ title: z.string().min(1), excerpt: z.string().min(1), bodyMd: z.string().min(1) }),
    si: z.object({ title: z.string().min(1), excerpt: z.string().min(1), bodyMd: z.string().min(1) }),
    ta: z.object({ title: z.string().min(1), excerpt: z.string().min(1), bodyMd: z.string().min(1) }),
  }),
});

export type Project = z.infer<typeof projectSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Article = z.infer<typeof articleSchema>;
