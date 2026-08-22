import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
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
      <Reveal>
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-ink-900 md:text-5xl">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("subtitle")}</p>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 80}>
            <TestimonialCard testimonial={testimonial} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
