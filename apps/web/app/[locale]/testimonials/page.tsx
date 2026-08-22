import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { Section } from "@/components/ui/Section";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("testimonials");
  return { title: t("title") };
}

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("testimonials");
  const testimonials = getAllTestimonials().map((testimonial) => localizeTestimonial(testimonial, locale as Locale));

  return (
    <Section>
      <div className="text-center">
        <h1 className="text-4xl font-black text-charcoal-900">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("subtitle")}</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Section>
  );
}
