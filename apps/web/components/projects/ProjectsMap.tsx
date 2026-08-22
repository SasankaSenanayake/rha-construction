"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ISLAND_PATH, MAP_HEIGHT, MAP_VIEW_BOX, MAP_WIDTH, resolveCityForLocation } from "@/lib/geo/sriLankaCities";
import { Icon } from "@/components/ui/Icon";
import type { LocalizedProject } from "@/lib/content/projects";

interface MapPin {
  key: string;
  x: number;
  y: number;
  label: string;
  projects: LocalizedProject[];
}

function scrollToProject(slug: string) {
  const target = document.getElementById(`project-${slug}`);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.add("map-highlight");
  window.setTimeout(() => target.classList.remove("map-highlight"), 1600);
}

export function ProjectsMap({ projects }: { projects: LocalizedProject[] }) {
  const t = useTranslations("projects");
  const [activePin, setActivePin] = useState<string | null>(null);

  const pins = useMemo(() => {
    const byCity = new Map<string, MapPin>();
    for (const project of projects) {
      const city = resolveCityForLocation(project.location);
      if (!city) continue;
      const key = city.label;
      const existing = byCity.get(key);
      if (existing) {
        existing.projects.push(project);
      } else {
        byCity.set(key, { key, x: city.x, y: city.y, label: city.label, projects: [project] });
      }
    }
    return Array.from(byCity.values());
  }, [projects]);

  if (pins.length === 0) return null;

  return (
    <div>
      <h2 className="text-center font-display text-xl font-semibold text-ink-900 md:text-2xl">{t("mapTitle")}</h2>
      <div className="relative mx-auto mt-6 aspect-[1/2] w-full max-w-sm">
        <svg viewBox={MAP_VIEW_BOX} className="absolute inset-0 h-full w-full text-sand-400" aria-hidden="true">
          <path d={ISLAND_PATH} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="6 5" strokeLinejoin="round" />
        </svg>

        {pins.map((pin) => (
          <div
            key={pin.key}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${(pin.x / MAP_WIDTH) * 100}%`, top: `${(pin.y / MAP_HEIGHT) * 100}%` }}
          >
            <button
              type="button"
              onMouseEnter={() => setActivePin(pin.key)}
              onMouseLeave={() => setActivePin((current) => (current === pin.key ? null : current))}
              onFocus={() => setActivePin(pin.key)}
              onClick={() => {
                setActivePin(pin.key);
                scrollToProject(pin.projects[0]!.slug);
              }}
              className="group relative flex flex-col items-center text-gold-600 transition-transform duration-200 hover:scale-110 hover:text-gold-500"
              aria-label={`${pin.label}: ${pin.projects.map((p) => p.title).join(", ")}`}
            >
              <Icon name="map-pin" className="h-7 w-7 drop-shadow-[0_1px_2px_rgba(10,18,32,0.35)]" />

              <span
                role="tooltip"
                className={`pointer-events-none absolute bottom-full mb-2 min-w-max max-w-[12rem] -translate-x-1/2 rounded-none border border-sand-200 bg-white px-3 py-2 text-left text-xs text-ink-800 shadow-soft-lg transition-opacity duration-200 ${
                  activePin === pin.key ? "opacity-100" : "opacity-0"
                }`}
                style={{ left: "50%" }}
              >
                <span className="block font-semibold text-ink-900">{pin.label}</span>
                {pin.projects.map((project) => (
                  <span key={project.slug} className="mt-0.5 block text-sand-600">
                    {project.title}
                  </span>
                ))}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
