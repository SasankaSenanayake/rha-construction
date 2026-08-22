"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PROJECT_TYPES } from "@rha/shared";
import type { LocalizedProject } from "@/lib/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectFilterBar({ projects }: { projects: LocalizedProject[] }) {
  const t = useTranslations("projects");
  const tc = useTranslations("services.categories");
  const common = useTranslations("common");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoriesPresent = useMemo(
    () => PROJECT_TYPES.filter((category) => projects.some((project) => project.category === category)),
    [projects],
  );

  const filtered = activeCategory ? projects.filter((project) => project.category === activeCategory) : projects;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterLabel")}>
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === null
              ? "border-safety-orange bg-safety-orange text-white"
              : "border-concrete-200 text-charcoal-800 hover:border-safety-orange"
          }`}
        >
          {common("allCategories")}
        </button>
        {categoriesPresent.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category
                ? "border-safety-orange bg-safety-orange text-white"
                : "border-concrete-200 text-charcoal-800 hover:border-safety-orange"
            }`}
          >
            {tc(category)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-concrete-600">{t("noResults")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
