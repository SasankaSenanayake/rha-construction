import { describe, expect, it } from "vitest";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";

describe("testimonials content", () => {
  it("loads all testimonial files with a rating between 1 and 5", () => {
    const testimonials = getAllTestimonials();
    expect(testimonials.length).toBeGreaterThan(0);
    for (const testimonial of testimonials) {
      expect(testimonial.rating).toBeGreaterThanOrEqual(1);
      expect(testimonial.rating).toBeLessThanOrEqual(5);
    }
  });

  it("localizes a testimonial quote", () => {
    const testimonial = getAllTestimonials()[0]!;
    expect(localizeTestimonial(testimonial, "si").quote.length).toBeGreaterThan(0);
  });
});
