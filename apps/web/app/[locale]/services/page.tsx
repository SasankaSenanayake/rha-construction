import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllServices, localizeService } from "@/lib/content/services";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeading } from "@/components/ui/PageHeading";
import { ServiceCard } from "@/components/services/ServiceCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  return { title: t("title") };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const services = getAllServices().map((service) => localizeService(service, locale as Locale));

  return (
    <Section>
      <Reveal>
        <PageHeading title={t("title")} subtitle={t("subtitle")} />
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 80}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
