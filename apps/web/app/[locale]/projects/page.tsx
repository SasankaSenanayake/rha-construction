import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllProjects, localizeProject } from "@/lib/content/projects";
import { Section } from "@/components/ui/Section";
import { ProjectFilterBar } from "@/components/projects/ProjectFilterBar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("projects");
  return { title: t("title") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = getAllProjects()
    .map((project) => localizeProject(project, locale as Locale))
    .sort((a, b) => b.year - a.year);

  return (
    <Section>
      <div className="text-center">
        <h1 className="text-4xl font-black text-charcoal-900">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("subtitle")}</p>
      </div>
      <div className="mt-10">
        <ProjectFilterBar projects={projects} />
      </div>
    </Section>
  );
}
