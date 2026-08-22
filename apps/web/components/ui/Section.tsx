import type { HTMLAttributes } from "react";

export function Section({
  tone = "light",
  className = "",
  /** Skips the centered max-width container — for content (like a
   * horizontal project scroller) that should bleed to the viewport edge
   * instead of stopping at the same 1200px column as everything else. */
  fullBleed = false,
  children,
  ...rest
}: { tone?: "light" | "dark" | "muted"; fullBleed?: boolean } & HTMLAttributes<HTMLElement>) {
  const toneClasses =
    tone === "dark"
      ? "blueprint-grid bg-ink-900 text-white"
      : tone === "muted"
        ? "bg-sand-100"
        : "bg-sand-50";
  return (
    <section className={`${toneClasses} py-16 md:py-28 ${className}`} {...rest}>
      {fullBleed ? children : <div className="container-page">{children}</div>}
    </section>
  );
}
