import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig, whatsappLink } from "@/lib/config/site";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tf = await getTranslations("footer");
  const tCommon = await getTranslations("common");

  return (
    <Section>
      <div className="text-center">
        <h1 className="text-4xl font-black text-charcoal-900">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-charcoal-900">{t("detailsTitle")}</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-safety-orange" />
              <a href={`tel:${siteConfig.phoneHref}`} className="font-semibold text-charcoal-900">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="whatsapp" className="mt-0.5 h-5 w-5 shrink-0 text-safety-orange" />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-charcoal-900">
                {tCommon("whatsapp")}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="mail" className="mt-0.5 h-5 w-5 shrink-0 text-safety-orange" />
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-charcoal-900">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="map-pin" className="mt-0.5 h-5 w-5 shrink-0 text-safety-orange" />
              <span className="text-charcoal-800">{siteConfig.address}</span>
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-charcoal-900">{tf("businessHours")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-charcoal-800">
            <li className="flex justify-between gap-4">
              <span>{tf("weekdays")}</span>
              <span>{siteConfig.businessHours.weekdays}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{tf("saturday")}</span>
              <span>{siteConfig.businessHours.saturday}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{tf("sunday")}</span>
              <span>{tf("closed")}</span>
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-charcoal-900">{t("mapTitle")}</h2>
          <div className="mt-3 aspect-square w-full overflow-hidden rounded border border-concrete-200">
            <iframe
              title={t("mapTitle")}
              src={siteConfig.googleMapsEmbedSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
