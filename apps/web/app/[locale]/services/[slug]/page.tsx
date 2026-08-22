import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { routing } from "@/lib/i18n/routing";
import { getAllServices, getServiceBySlug, localizeService } from "@/lib/content/services";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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
      <section className="blueprint-grid bg-ink-900 py-20 text-white">
        <div className="container-page">
          <Reveal>
            <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-white/10 text-gold-400">
              <Icon name={localized.icon as never} className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold md:text-5xl">{localized.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sand-200">{localized.shortDescription}</p>
          </Reveal>
        </div>
      </section>

      <Section>
        <Reveal>
          <h2 className="font-serif text-2xl font-semibold text-ink-900">{t("processTitle")}</h2>
        </Reveal>
        <div className="mt-7">
          <ProcessSteps steps={localized.processSteps} />
        </div>
      </Section>

      {localized.gallery.length > 0 && (
        <Section tone="muted">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold text-ink-900">{t("galleryTitle")}</h2>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3">
            {localized.gallery.map((image) => (
              <div key={image.src} className="group aspect-[3/2] overflow-hidden rounded-sm bg-ink-800">
                <img
                  src={image.src}
                  alt={image.alt[locale as Locale]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone="dark">
        <Reveal className="text-center">
          <h2 className="font-serif text-2xl font-semibold">{t("ctaTitle")}</h2>
          <LinkButton href="/quote" className="mt-7">
            {tc("getQuote")}
          </LinkButton>
        </Reveal>
      </Section>
    </>
  );
}
