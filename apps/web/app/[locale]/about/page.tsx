import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { DarkHero } from "@/components/layout/DarkHero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("title") };
}

const whyChooseUsIcons = ["hammer", "clipboard", "check", "clock"] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tWhyUs = await getTranslations("home.whyUs");

  const whyUsItems = [
    { title: tWhyUs("experienceTitle"), body: tWhyUs("experienceBody") },
    { title: tWhyUs("qualityTitle"), body: tWhyUs("qualityBody") },
    { title: tWhyUs("transparencyTitle"), body: tWhyUs("transparencyBody") },
    { title: tWhyUs("supportTitle"), body: tWhyUs("supportBody") },
  ];

  return (
    <>
      <DarkHero>
        <Reveal>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{t("title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-200">{t("intro")}</p>
        </Reveal>
      </DarkHero>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink-900">{t("historyTitle")}</h2>
            <p className="mt-4 leading-relaxed text-sand-600">{t("historyBody")}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-2xl font-semibold text-ink-900">{t("missionTitle")}</h2>
            <p className="mt-4 leading-relaxed text-sand-600">{t("missionBody")}</p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-ink-900 md:text-4xl">{t("whyChooseUsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="h-full rounded-none border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft">
                <Icon name={whyChooseUsIcons[index]!} className="h-8 w-8 text-gold-500" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
