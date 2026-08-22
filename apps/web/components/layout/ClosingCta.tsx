import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { CircleCta } from "@/components/ui/CircleCta";

/**
 * Closing CTA band: an oversized headline that bleeds off the frame rather
 * than sitting politely inside the container — the one deliberately loud
 * typographic moment on the page.
 */
export async function ClosingCta() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-ink-950 py-28 text-white md:py-40">
      <Reveal>
        <h2 className="whitespace-nowrap pl-5 font-display text-6xl font-bold leading-none sm:pl-8 sm:text-7xl md:text-8xl lg:text-9xl">
          {t("ctaTitle")}
        </h2>
      </Reveal>
      <div className="container-page mt-12">
        <Reveal delay={100}>
          <p className="max-w-md text-sand-300">{t("ctaSubtitle")}</p>
          <CircleCta href="/quote" tone="light" className="mt-9">
            {tCommon("getQuote")}
          </CircleCta>
        </Reveal>
      </div>
    </section>
  );
}
