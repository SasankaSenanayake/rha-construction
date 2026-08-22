import type { Locale } from "@rha/shared";
import { loadContentDir } from "./fs-utils";
import { testimonialSchema, type Testimonial } from "./schema";

let cache: Testimonial[] | undefined;

export function getAllTestimonials(): Testimonial[] {
  if (!cache) {
    cache = loadContentDir("testimonials", testimonialSchema);
  }
  return cache;
}

export interface LocalizedTestimonial {
  id: string;
  clientName: string;
  projectSlug?: string;
  rating: number;
  quote: string;
}

export function localizeTestimonial(testimonial: Testimonial, locale: Locale): LocalizedTestimonial {
  return {
    id: testimonial.id,
    clientName: testimonial.clientName,
    projectSlug: testimonial.projectSlug,
    rating: testimonial.rating,
    quote: testimonial.translations[locale].quote,
  };
}
