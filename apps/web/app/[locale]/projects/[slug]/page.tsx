import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { routing } from "@/lib/i18n/routing";
import { getAllProjects, getProjectBySlug, localizeProject } from "@/lib/content/projects";
import { markdownToHtml } from "@/lib/content/markdown";
import { Section } from "@/components/ui/Section";
import { CircleCta } from "@/components/ui/CircleCta";
import { Reveal } from "@/components/ui/Reveal";
import { DarkHero } from "@/components/layout/DarkHero";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { CaseStudyBody } from "@/components/projects/CaseStudyBody";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllProjects().map((project) => ({ locale, slug: project.slug })));
}

// Only these 3 projects have a generated hero video so far — the rest keep their static cover photo.
const projectHeroVideos: Record<string, string> = {
  "colombo-office-fitout": "/videos/projects/colombo-office-fitout.mp4",
  "kandy-retail-renovation": "/videos/projects/kandy-retail-renovation.mp4",
  "nugegoda-family-home": "/videos/projects/nugegoda-family-home.mp4",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: localizeProject(project, locale as Locale).title };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const localized = localizeProject(project, locale as Locale);
  const bodyHtml = await markdownToHtml(localized.bodyMd);
  const t = await getTranslations("projects");
  const tc = await getTranslations("common");
  const tCategories = await getTranslations("services.categories");
  const cover = localized.images[0];

  return (
    <>
      <DarkHero image={cover?.src} imageAlt={cover?.alt[locale as Locale]} video={projectHeroVideos[slug]}>
        <Reveal>
          <CircleCta href="/projects" tone="light" direction="back" className="mb-8">
            {tc("backToProjects")}
          </CircleCta>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-300">
            {tCategories(localized.category)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{localized.title}</h1>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-sand-200">
            <span>
              {t("locationLabel")}: {localized.location}
            </span>
            <span>
              {t("yearLabel")}: {localized.year}
            </span>
          </div>
        </Reveal>
      </DarkHero>

      <Section>
        <Reveal as="div" className="mx-auto max-w-3xl">
          <CaseStudyBody html={bodyHtml} />
        </Reveal>
      </Section>

      {localized.images.length > 1 && (
        <Section tone="muted">
          <Reveal>
            <ProjectGallery images={localized.images} />
          </Reveal>
        </Section>
      )}

      <Section tone="dark">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="font-display text-2xl font-semibold">{tc("getQuote")}</h2>
          <CircleCta href="/quote" tone="light" className="mt-7">
            {tc("getQuote")}
          </CircleCta>
        </Reveal>
      </Section>
    </>
  );
}
