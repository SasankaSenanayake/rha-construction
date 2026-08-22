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
        {projects.map((project) => (
          <div key={project.slug} className="w-[85%] flex-none sm:w-[55%] lg:w-[34%]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
