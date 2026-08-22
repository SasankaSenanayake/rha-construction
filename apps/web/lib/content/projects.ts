import type { Locale } from "@rha/shared";
import { assertImageExists, loadContentDir } from "./fs-utils";
import { projectSchema, type Project } from "./schema";

let cache: Project[] | undefined;

export function getAllProjects(): Project[] {
  if (!cache) {
    const projects = loadContentDir<Project>("projects", projectSchema);
    for (const project of projects) {
      for (const image of project.images) {
        assertImageExists(image.src, `project ${project.slug}`);
      }
    }
    cache = projects;
  }
  return cache;
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  return getAllProjects().filter((project) => project.category === category);
}

export interface LocalizedProject {
  slug: string;
  category: Project["category"];
  location: string;
  year: number;
  featured: boolean;
  images: Project["images"];
  title: string;
  summary: string;
  bodyMd: string;
}

export function localizeProject(project: Project, locale: Locale): LocalizedProject {
  const translation = project.translations[locale];
  return {
    slug: project.slug,
    category: project.category,
    location: project.location,
    year: project.year,
    featured: project.featured,
    images: project.images,
    title: translation.title,
    summary: translation.summary,
    bodyMd: translation.bodyMd,
  };
}
