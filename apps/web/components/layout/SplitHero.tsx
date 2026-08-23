import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { CircleCta } from "@/components/ui/CircleCta";
import { CinematicHeroImage } from "@/components/layout/CinematicHeroImage";
import { CinematicHeroVideo } from "@/components/layout/CinematicHeroVideo";

/**
 * Asymmetric split hero: a full-bleed photo (or video) on one side, the
 * headline held in open whitespace on the other. Text is never printed on
 * top of the media — the two halves stay strictly separate.
 */
export async function SplitHero({
  image,
  imageAlt,
  video,
  videoObjectPosition,
  videoBaseZoom,
}: {
  image: string;
  imageAlt?: string;
  /** When set, an autoplaying background video replaces the static image; `image` becomes its poster frame. */
  video?: string;
  /** Crop controls passed through to the video, e.g. to crop a baked-in watermark out of frame. */
  videoObjectPosition?: string;
  videoBaseZoom?: number;
}) {
  const t = await getTranslations("home");

  return (
    <section className="grid min-h-hero grid-cols-1 bg-sand-50 lg:grid-cols-12">
      <div className="relative order-1 h-hero-media overflow-hidden lg:order-1 lg:col-span-8 lg:h-auto">
        {video ? (
          <CinematicHeroVideo src={video} poster={image} objectPosition={videoObjectPosition} baseZoom={videoBaseZoom} />
        ) : (
          <CinematicHeroImage src={image} alt={imageAlt} objectPosition="85% 78%" baseZoom={1.6} />
        )}
      </div>

      <div className="order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-2 lg:col-span-4 lg:px-14 lg:py-0">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-600">{siteConfig.companyName}</p>
          <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] text-ink-950 sm:text-6xl">
            {t.rich("heroTitle", {
              light: (chunks) => <span className="font-sans font-normal text-sand-600">{chunks}</span>,
            })}
          </h1>

          <div className="mt-12">
            <CircleCta href="/quote" tone="dark">
              {t("heroCtaPrimary")}
            </CircleCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
