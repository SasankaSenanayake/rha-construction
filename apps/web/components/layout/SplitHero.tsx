import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { CircleCta } from "@/components/ui/CircleCta";
import { CinematicHeroImage } from "@/components/layout/CinematicHeroImage";

/**
 * Asymmetric split hero: a full-bleed photo on one side, the headline held
 * in open whitespace on the other. Text is never printed on top of the
 * image — the two halves stay strictly separate.
 */
export async function SplitHero({ image, imageAlt }: { image: string; imageAlt?: string }) {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <section className="grid min-h-hero grid-cols-1 bg-sand-50 lg:grid-cols-5">
      <div className="relative order-1 h-hero-media overflow-hidden lg:order-1 lg:col-span-3 lg:h-auto">
        <CinematicHeroImage src={image} alt={imageAlt} objectPosition="85% 78%" baseZoom={1.6} />
      </div>

      <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-2 lg:col-span-2 lg:px-16 lg:py-0">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-600">{siteConfig.companyName}</p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-none text-ink-950 sm:text-6xl lg:text-7xl">
            {t.rich("heroTitle", {
              light: (chunks) => <span className="font-sans font-normal text-sand-600">{chunks}</span>,
            })}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-sand-600">{t("heroSubtitle")}</p>

          <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-6">
            <CircleCta href="/quote" tone="dark">
              {t("heroCtaPrimary")}
            </CircleCta>
            <CircleCta href="/projects" tone="dark" className="opacity-60 hover:opacity-100">
              {t("heroCtaSecondary")}
            </CircleCta>
          </div>

          <div className="mt-14 flex divide-x divide-sand-200 border-t border-sand-200 pt-8">
            <div className="pr-8">
              <p className="font-display text-3xl font-bold text-ink-950">{siteConfig.yearsInBusiness}+</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-sand-600">{tCommon("yearsInBusiness")}</p>
            </div>
            <div className="pl-8">
              <p className="font-display text-3xl font-bold text-ink-950">{siteConfig.projectsCompleted}+</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-sand-600">{tCommon("projectsCompleted")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
