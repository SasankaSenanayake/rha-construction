import type { ReactNode } from "react";
import { CinematicHeroImage } from "@/components/layout/CinematicHeroImage";

/**
 * Shared hero for inner pages (about, service/project/article detail).
 * With an `image`, it's an asymmetric split — the photo full-bleeds on its
 * own side, the caption sits in open space on solid ink-950, never printed
 * on top of the photo. Without one, it falls back to the flat
 * blueprint-grid treatment so pages with no photography still feel
 * intentional.
 */
export function DarkHero({ image, imageAlt, children }: { image?: string; imageAlt?: string; children: ReactNode }) {
  if (!image) {
    return (
      <section className="blueprint-grid bg-ink-900 py-20 text-white">
        <div className="container-page">{children}</div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 bg-ink-950 text-white lg:grid-cols-5">
      <div className="relative order-1 h-64 overflow-hidden sm:h-80 lg:col-span-2 lg:h-auto">
        <CinematicHeroImage src={image} alt={imageAlt ?? ""} />
      </div>
      <div className="order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-3 lg:px-16 lg:py-20">
        {children}
      </div>
    </section>
  );
}
