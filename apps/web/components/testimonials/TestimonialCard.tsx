import { Icon } from "@/components/ui/Icon";
import type { LocalizedTestimonial } from "@/lib/content/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: LocalizedTestimonial }) {
  return (
    <figure className="rounded border border-concrete-200 bg-white p-6">
      <div className="flex gap-0.5 text-safety-yellow" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} name="star" className={`h-4 w-4 ${index < testimonial.rating ? "" : "opacity-25"}`} />
        ))}
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-charcoal-800">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-charcoal-900">{testimonial.clientName}</figcaption>
    </figure>
  );
}
