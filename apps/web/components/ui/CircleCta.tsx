import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

const toneClasses = {
  dark: "border-ink-900/30 text-ink-900 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-white",
  light: "border-white/40 text-white group-hover:border-white group-hover:bg-white group-hover:text-ink-950",
  gold: "border-ink-900/30 text-ink-900 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-ink-950",
} as const;

/**
 * Text + circular icon CTA — no filled rectangle anywhere. The circle is a
 * bare ring at rest and only fills on hover/focus, so the accent color (when
 * used) is a hover-only flourish rather than a permanent block of chrome.
 * Primary-vs-secondary hierarchy is signalled with opacity/weight, not fill.
 */
export function CircleCta({
  href,
  children,
  tone = "dark",
  /** "back" points the arrow southwest (toward a previous page) instead of
   * the default forward/northeast — same circle-and-arrow language, correct
   * direction for a "back to X" link. */
  direction = "forward",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof toneClasses;
  direction?: "forward" | "back";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={`group inline-flex items-center gap-4 ${className}`}>
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${toneClasses[tone]}`}
      >
        <Icon
          name="arrow-up-right"
          className={`h-4 w-4 transition-transform duration-300 ${
            direction === "back" ? "rotate-180 group-hover:rotate-[225deg]" : "group-hover:rotate-45"
          }`}
        />
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.15em]">{children}</span>
    </Link>
  );
}
