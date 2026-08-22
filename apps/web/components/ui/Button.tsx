import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-safety-orange text-white hover:bg-safety-orange-dark",
  secondary: "bg-white text-charcoal-900 border border-charcoal-900 hover:bg-charcoal-900 hover:text-white",
  ghost: "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors";

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
    <button className={`${baseClasses} ${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...rest}>
      {children}
    </button>
  );
}
