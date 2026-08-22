import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
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
        <div className="text-center">
          <h1 className="text-4xl font-black text-charcoal-900">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("subtitle")}</p>
        </div>
        <div className="mt-10">
          <QuoteForm />
        </div>
      </div>
    </Section>
  );
}
