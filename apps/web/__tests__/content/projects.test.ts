import { describe, expect, it } from "vitest";
import { getAllProjects, getFeaturedProjects, getProjectBySlug, localizeProject } from "@/lib/content/projects";

describe("projects content", () => {
  it("loads and validates every project file in content/projects", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it("exposes at least one featured project for the homepage", () => {
    expect(getFeaturedProjects().length).toBeGreaterThan(0);
  });

  it("finds a project by slug", () => {
    const project = getProjectBySlug("nugegoda-family-home");
    expect(project?.category).toBe("residential");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("localizes a project into the requested locale", () => {
    const project = getProjectBySlug("nugegoda-family-home")!;
    const en = localizeProject(project, "en");
    const si = localizeProject(project, "si");
    expect(en.title).not.toBe(si.title);
    expect(en.slug).toBe(si.slug);
  });
});
