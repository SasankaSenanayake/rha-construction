import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { LocalizedProject } from "@/lib/content/projects";

export function ProjectCard({ project, index }: { project: LocalizedProject; index?: number }) {
  const t = useTranslations("common");
  const tc = useTranslations("services.categories");
  const cover = project.images[0];

  return (
    <Link
      id={`project-${project.slug}`}
      href={`/projects/${project.slug}`}
      className="group block scroll-mt-24 overflow-hidden rounded-none bg-ink-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="notch-panel relative aspect-[3/4] overflow-hidden bg-ink-800 [--notch:28px]">
        {cover && (
          <img
            src={cover.src}
            alt={cover.alt.en}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
        {typeof index === "number" && (
          <span className="absolute left-4 top-4 font-display text-sm font-semibold tracking-wide text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-700">
          {tc(project.category)} · {project.location}
        </p>
        <h3 className="mt-2.5 font-display text-xl font-semibold text-ink-900">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sand-600">{project.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors group-hover:text-ink-950">
          {t("viewCaseStudy")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
