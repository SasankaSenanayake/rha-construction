import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { routing } from "@/lib/i18n/routing";
import { getAllServices, getServiceBySlug, localizeService } from "@/lib/content/services";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProcessSteps } from "@/components/services/ProcessSteps";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllServices().map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: localizeService(service, locale as Locale).title };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const localized = localizeService(service, locale as Locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("common");

  return (
    <>
      <section className="bg-charcoal-900 py-16 text-white">
        <div className="hazard-rule" />
        <div className="container-page pt-10">
          <span className="flex h-14 w-14 items-center justify-center rounded bg-white/10 text-safety-yellow">
            <Icon name={localized.icon as never} className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-4xl font-black">{localized.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-concrete-200">{localized.shortDescription}</p>
        </div>
      </section>

      <Section>
        <h2 className="text-2xl font-bold text-charcoal-900">{t("processTitle")}</h2>
        <div className="mt-6">
          <ProcessSteps steps={localized.processSteps} />
        </div>
      </Section>

      {localized.gallery.length > 0 && (
        <Section tone="muted">
          <h2 className="text-2xl font-bold text-charcoal-900">{t("galleryTitle")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {localized.gallery.map((image) => (
              <div key={image.src} className="aspect-[3/2] overflow-hidden rounded bg-charcoal-800">
                <img src={image.src} alt={image.alt[locale as Locale]} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone="dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
          <LinkButton href="/quote" className="mt-6">
            {tc("getQuote")}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
