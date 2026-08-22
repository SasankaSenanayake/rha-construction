"use client";

import { useEffect, useRef } from "react";

/**
 * Hero/detail background image with a continuous scroll-linked zoom (rather
 * than a one-shot CSS animation), so the image keeps drifting in as the
 * visitor scrolls past it. No-ops under prefers-reduced-motion.
 */
export function CinematicHeroImage({
  src,
  alt = "",
  objectPosition,
  baseZoom = 1.04,
}: {
  src: string;
  alt?: string;
  objectPosition?: string;
  /** Static crop-in beyond the default 1.04, for a source photo that needs
   * to read as a tighter detail shot rather than a full establishing view. */
  baseZoom?: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const max = window.innerHeight * 1.15;
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      img.style.transform = `scale(${baseZoom + progress * 0.14})`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [baseZoom]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      style={{ objectPosition, transform: `scale(${baseZoom})` }}
      className="h-full w-full object-cover will-change-transform"
    />
  );
}
