import type { Locale } from "@rha/shared";
import { assertImageExists, loadContentDir } from "./fs-utils";
import { serviceSchema, type Service } from "./schema";

let cache: Service[] | undefined;

export function getAllServices(): Service[] {
  if (!cache) {
    const services = loadContentDir<Service>("services", serviceSchema);
    for (const service of services) {
      for (const locale of ["en", "si", "ta"] as const) {
        for (const image of service.translations[locale].gallery) {
          assertImageExists(image.src, `service ${service.slug} (${locale})`);
        }
      }
    }
    cache = services.sort((a, b) => a.order - b.order);
  }
  return cache;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getAllServices().find((service) => service.slug === slug);
}

export interface LocalizedService {
  slug: Service["slug"];
  icon: string;
  title: string;
  shortDescription: string;
  processSteps: string[];
  gallery: Service["translations"]["en"]["gallery"];
}

export function localizeService(service: Service, locale: Locale): LocalizedService {
  const translation = service.translations[locale];
  return {
    slug: service.slug,
    icon: service.icon,
    title: translation.title,
    shortDescription: translation.shortDescription,
    processSteps: translation.processSteps,
    gallery: translation.gallery,
  };
}
