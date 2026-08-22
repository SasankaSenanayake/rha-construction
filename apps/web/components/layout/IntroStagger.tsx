import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { CircleCta } from "@/components/ui/CircleCta";

type StaggerImage = { src: string; alt: string };

/**
 * Philosophy statement paired with two photos staggered against each other
 * (one dropped lower than the other) rather than aligned to a shared grid
 * line — plenty of open whitespace around both.
 */
export async function IntroStagger({ images }: { images: [StaggerImage, StaggerImage] }) {
  const t = await getTranslations("home");

  return (
    <section className="bg-sand-50 py-20 md:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-600">{t("introEyebrow")}</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-ink-950 md:text-4xl">
            {t.rich("introTitle", {
              light: (chunks) => <span className="font-sans font-normal text-sand-600">{chunks}</span>,
            })}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-sand-600">{t("introBody")}</p>
          <CircleCta href="/about" tone="dark" className="mt-10">
            {t("introCta")}
          </CircleCta>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="notch-panel aspect-[3/4] overflow-hidden bg-ink-800 [--notch:28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].src} alt={images[0].alt} className="h-full w-full object-cover" />
            </div>
            <div className="notch-panel-bl aspect-[3/4] translate-y-12 overflow-hidden bg-ink-800 sm:translate-y-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[1].src} alt={images[1].alt} className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
