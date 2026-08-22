import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllProjects, localizeProject } from "@/lib/content/projects";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
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
      <Reveal>
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-ink-900 md:text-5xl">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("subtitle")}</p>
        </div>
      </Reveal>
      <Reveal delay={100} className="mt-12">
        <ProjectFilterBar projects={projects} />
      </Reveal>
    </Section>
  );
}
