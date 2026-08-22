import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

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
      <section className="bg-charcoal-900 py-16 text-white">
        <div className="hazard-rule" />
        <div className="container-page pt-10">
          <h1 className="text-4xl font-black">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-concrete-200">{t("intro")}</p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-charcoal-900">{t("historyTitle")}</h2>
            <p className="mt-4 leading-relaxed text-concrete-600">{t("historyBody")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-charcoal-900">{t("missionTitle")}</h2>
            <p className="mt-4 leading-relaxed text-concrete-600">{t("missionBody")}</p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="text-center text-3xl font-bold text-charcoal-900">{t("whyChooseUsTitle")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsItems.map((item, index) => (
            <div key={item.title} className="rounded border border-concrete-200 bg-white p-6">
              <Icon name={whyChooseUsIcons[index]!} className="h-8 w-8 text-safety-orange" />
              <h3 className="mt-4 font-bold text-charcoal-900">{item.title}</h3>
              <p className="mt-2 text-sm text-concrete-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
