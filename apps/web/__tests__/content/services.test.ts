import { describe, expect, it } from "vitest";
import { PROJECT_TYPES } from "@rha/shared";
import { getAllServices, getServiceBySlug, localizeService } from "@/lib/content/services";

describe("services content", () => {
  it("loads exactly one service per project type, sorted by order", () => {
    const services = getAllServices();
    expect(services.map((s) => s.slug).sort()).toEqual([...PROJECT_TYPES].sort());
    for (let i = 1; i < services.length; i++) {
      expect(services[i]!.order).toBeGreaterThan(services[i - 1]!.order);
    }
  });

  it("localizes a service into the requested locale", () => {
    const service = getServiceBySlug("residential")!;
    const localized = localizeService(service, "ta");
    expect(localized.processSteps.length).toBeGreaterThan(0);
  });
});
