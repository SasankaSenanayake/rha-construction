import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("quote");
  return { title: t("title") };
}

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quote");

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="text-center">
            <h1 className="font-serif text-4xl font-semibold text-ink-900 md:text-5xl">{t("title")}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("subtitle")}</p>
          </div>
        </Reveal>
        <Reveal delay={100} className="mt-12">
          <div className="rounded-sm border border-sand-200 bg-white p-7 shadow-soft sm:p-9">
            <QuoteForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
