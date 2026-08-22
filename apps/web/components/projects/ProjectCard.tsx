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
      className="group block overflow-hidden rounded-sm border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-ink-800">
        {cover && (
          <img
            src={cover.src}
            alt={cover.alt.en}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
          {tc(project.category)} · {project.location}
        </p>
        <h3 className="mt-2.5 font-serif text-xl font-semibold text-ink-900">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sand-600">{project.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors group-hover:text-gold-600">
          {t("viewCaseStudy")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
