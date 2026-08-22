"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Thin gold rule that grows in from the left on scroll-into-view — the
 * architectural "blueprint line" rhythm between homepage sections. Plain
 * IntersectionObserver (matches Reveal.tsx), no GSAP needed for a single
 * scaleX transform.
 */
export function AnimatedDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`container-page ${className}`}>
      <div
        ref={ref}
        aria-hidden="true"
        className={`accent-rule origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </div>
  );
}
