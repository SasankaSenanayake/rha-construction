import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { LocalizedProject } from "@/lib/content/projects";

export function ProjectCard({ project }: { project: LocalizedProject }) {
  const t = useTranslations("common");
  const tc = useTranslations("services.categories");
  const cover = project.images[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded border border-concrete-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[3/2] overflow-hidden bg-charcoal-800">
        {cover && (
          <img
            src={cover.src}
            alt={cover.alt.en}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-safety-orange">
          {tc(project.category)} · {project.location}
        </p>
        <h3 className="mt-2 text-lg font-bold text-charcoal-900">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-concrete-600">{project.summary}</p>
        <span className="mt-4 inline-block text-sm font-semibold text-charcoal-900 group-hover:text-safety-orange">
          {t("viewCaseStudy")} →
        </span>
      </div>
    </Link>
  );
}
