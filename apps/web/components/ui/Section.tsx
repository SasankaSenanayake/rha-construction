import type { HTMLAttributes } from "react";

export function Section({
  tone = "light",
  className = "",
  children,
  ...rest
}: { tone?: "light" | "dark" | "muted" } & HTMLAttributes<HTMLElement>) {
  const toneClasses =
    tone === "dark"
      ? "blueprint-grid bg-ink-900 text-white"
      : tone === "muted"
        ? "bg-sand-100"
        : "bg-sand-50";
  return (
    <section className={`${toneClasses} py-16 md:py-28 ${className}`} {...rest}>
      <div className="container-page">{children}</div>
    </section>
  );
}
