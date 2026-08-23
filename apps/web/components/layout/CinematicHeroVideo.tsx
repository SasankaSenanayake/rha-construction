"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying hero background video with the same continuous scroll-linked
 * zoom as CinematicHeroImage. Under prefers-reduced-motion, playback is
 * paused immediately after mount and the poster frame is shown instead.
 */
export function CinematicHeroVideo({
  src,
  poster,
  objectPosition,
  baseZoom = 1.04,
}: {
  src: string;
  poster?: string;
  objectPosition?: string;
  /** Static crop-in beyond the default 1.04 — also used to crop out a
   * baked-in watermark sitting in a corner of the source clip. */
  baseZoom?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // The `autoplay` attribute alone is unreliable on iOS Chrome/Safari —
    // it can silently no-op and leave the poster frame showing until a
    // user gesture. Setting `muted` as a JS property (not just the JSX
    // attribute) and explicitly calling play() is the standard fix.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay still blocked (e.g. Low Power Mode) — poster stays up,
      // which is an acceptable fallback rather than a broken page.
    });

    let raf = 0;
    const update = () => {
      const max = window.innerHeight * 1.15;
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      video.style.transform = `scale(${baseZoom + progress * 0.14})`;
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
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      style={{ objectPosition, transform: `scale(${baseZoom})` }}
      className="h-full w-full object-cover will-change-transform"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
