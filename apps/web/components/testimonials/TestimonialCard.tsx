import { Icon } from "@/components/ui/Icon";
import type { LocalizedTestimonial } from "@/lib/content/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: LocalizedTestimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-none border border-sand-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft-lg">
      <div className="flex gap-0.5 text-gold-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} name="star" className={`h-4 w-4 ${index < testimonial.rating ? "" : "opacity-20"}`} />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-ink-800">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t border-sand-100 pt-4 text-sm font-semibold text-ink-900">
        {testimonial.clientName}
      </figcaption>
    </figure>
  );
}
