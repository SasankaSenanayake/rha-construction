import type { HTMLAttributes } from "react";

export function Section({
  tone = "light",
  className = "",
  children,
  ...rest
}: { tone?: "light" | "dark" | "muted" } & HTMLAttributes<HTMLElement>) {
  const toneClasses =
    tone === "dark" ? "bg-charcoal-900 text-white" : tone === "muted" ? "bg-concrete-100" : "bg-white";
  return (
    <section className={`${toneClasses} py-16 md:py-24 ${className}`} {...rest}>
      <div className="container-page">{children}</div>
    </section>
  );
}
