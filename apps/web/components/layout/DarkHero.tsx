import type { ReactNode } from "react";

/**
 * Shared dark hero for inner pages (about, service/project detail). With an
 * `image`, it renders full-bleed cinematic-style: slow Ken Burns zoom behind a
 * scrim, caption held in a notch-cut panel. Without one, it falls back to the
 * flat blueprint-grid treatment so pages with no photography still feel intentional.
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
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={imageAlt ?? ""} className="h-full w-full animate-ken-burns object-cover" />
        <div className="absolute inset-0 bg-ink-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
      </div>
      <div className="container-page py-24 md:py-28">
        <div className="notch-panel max-w-xl bg-ink-950/80 p-8 backdrop-blur-sm md:p-10">{children}</div>
      </div>
    </section>
  );
}
