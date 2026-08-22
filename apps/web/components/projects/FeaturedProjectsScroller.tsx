"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureScrollTrigger, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion/gsap";
import { ProjectCard } from "./ProjectCard";
import type { LocalizedProject } from "@/lib/content/projects";

/**
 * Signature homepage moment: pins vertically while scroll drives the project
 * cards sideways (GSAP ScrollTrigger pin+scrub). Deliberately the only
 * pinned section on the page — stacking more fights native scroll feel.
 *
 * The track is a native overflow-x-auto strip by default, so reduced-motion
 * and no-JS visitors reach every project via ordinary horizontal scroll;
 * the pin/scrub only takes over once GSAP actually initializes it.
 */
export function FeaturedProjectsScroller({ projects }: { projects: LocalizedProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (prefersReducedMotion() || !container || !track) return;
      ensureScrollTrigger();

      let tween: gsap.core.Tween | undefined;

      const setup = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        track.style.overflowX = "";

        const distance = track.scrollWidth - container.clientWidth;
        if (distance <= 0) return;

        track.style.overflowX = "visible";
        tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      };

      setup();

      const images = Array.from(track.querySelectorAll("img"));
      const onImageLoad = () => ScrollTrigger.refresh();
      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onImageLoad, { once: true });
      });

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        track.style.overflowX = "";
        images.forEach((img) => img.removeEventListener("load", onImageLoad));
      };
    },
    { scope: containerRef, dependencies: [projects.length] },
  );

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
      >
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className={`w-4/5 flex-none sm:w-1/2 lg:w-1/3 ${index % 2 === 1 ? "lg:translate-y-12" : ""}`}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>
      {/* Signals "more to scroll" and softens the trailing card's caption
       * instead of letting the viewport edge cut its text off mid-word. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-sand-100 lg:block" />
      <div className="mt-8 hidden h-px w-full bg-sand-200 lg:block">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-ink-900"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
