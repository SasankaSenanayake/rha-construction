"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { ensureScrollTrigger, gsap, prefersReducedMotion } from "@/lib/motion/gsap";

/**
 * Wipe-reveal for headlines: content renders fully visible in the DOM (no
 * opacity:0 gating, so no-JS/reduced-motion visitors just see it), and an
 * overlay panel that starts covering it slides off on scroll-into-view.
 */
export function MaskReveal({
  children,
  as: Tag = "div",
  tone = "dark",
  inline = false,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  tone?: "dark" | "gold";
  /** Shrink-wraps the mask to the text instead of the full block width — use
   * for short, typically-centered headings so the overlay hugs the glyphs
   * instead of covering the whole (often centered) block and leaving a
   * disconnected-looking remnant mid-wipe. Leave false for content that can
   * wrap across multiple lines at its natural block width, like the hero H1. */
  inline?: boolean;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !overlayRef.current) return;
      ensureScrollTrigger();

      gsap.set(overlayRef.current, { xPercent: 0 });
      gsap.to(overlayRef.current, {
        xPercent: 100,
        duration: 0.9,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${inline ? "inline-block" : "block"}`}>
      <Tag className={className}>{children}</Tag>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${tone === "gold" ? "bg-gold-500" : "bg-ink-950"}`}
      />
    </div>
  );
}
