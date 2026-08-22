import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold-500 text-ink-950 shadow-gold hover:bg-gold-400 hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-ink-900 border border-ink-900/25 hover:border-ink-900 hover:bg-ink-900 hover:text-white hover:-translate-y-0.5",
  ghost: "bg-white/5 text-white border border-white/25 backdrop-blur-sm hover:border-gold-400 hover:bg-white/10 hover:-translate-y-0.5",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`} {...rest}>
      {children}
    </button>
  );
}
