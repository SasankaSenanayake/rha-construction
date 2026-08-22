"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES, type Locale } from "@rha/shared";

const labels: Record<Locale, string> = { en: "EN", si: "සිං", ta: "தமிழ்" };

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale ? "true" : undefined}
          className={`rounded-none px-2 py-1 text-xs font-semibold transition-colors ${
            loc === locale ? "bg-gold-500 text-ink-950" : "text-sand-200 hover:text-white"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
