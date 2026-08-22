import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { routing } from "@/lib/i18n/routing";
import { getAllProjects, getProjectBySlug, localizeProject } from "@/lib/content/projects";
import { markdownToHtml } from "@/lib/content/markdown";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { CaseStudyBody } from "@/components/projects/CaseStudyBody";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllProjects().map((project) => ({ locale, slug: project.slug })));
}

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
      <section className="bg-charcoal-900 py-16 text-white">
        <div className="hazard-rule" />
        <div className="container-page pt-10">
          <LinkButton href="/projects" variant="ghost" className="mb-6">
            ← {tc("backToProjects")}
          </LinkButton>
          <p className="text-sm font-semibold uppercase tracking-wide text-safety-yellow">
            {tCategories(localized.category)}
          </p>
          <h1 className="mt-2 text-4xl font-black">{localized.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-concrete-200">
            <span>
              {t("locationLabel")}: {localized.location}
            </span>
            <span>
              {t("yearLabel")}: {localized.year}
            </span>
          </div>
        </div>
      </section>

      {cover && (
        <div className="aspect-[16/7] w-full overflow-hidden bg-charcoal-800">
          <img src={cover.src} alt={cover.alt[locale as Locale]} className="h-full w-full object-cover" />
        </div>
      )}

      <Section>
        <div className="mx-auto max-w-3xl">
          <CaseStudyBody html={bodyHtml} />
        </div>
      </Section>

      {localized.images.length > 1 && (
        <Section tone="muted">
          <ProjectGallery images={localized.images} />
        </Section>
      )}

      <Section tone="dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{tc("getQuote")}</h2>
          <LinkButton href="/quote" className="mt-6">
            {tc("getQuote")}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
