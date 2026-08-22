"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-charcoal-900 text-white">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <a href={`tel:${siteConfig.phoneHref}`} className="flex items-center gap-1.5 font-semibold text-safety-yellow">
            <Icon name="phone" className="h-3.5 w-3.5" />
            {siteConfig.phoneDisplay}
          </a>
          <LocaleSwitcher />
        </div>
      </div>

      <div className="border-b border-concrete-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-charcoal-900">
            <img src="/images/site/logo.svg" alt={siteConfig.companyName} className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-charcoal-800 hover:text-safety-orange"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/quote"
              className="inline-flex items-center rounded bg-safety-orange px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-safety-orange-dark"
            >
              {tc("getQuote")}
            </Link>
          </div>

          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-6 bg-charcoal-900" />
            <span className="mt-1.5 block h-0.5 w-6 bg-charcoal-900" />
            <span className="mt-1.5 block h-0.5 w-6 bg-charcoal-900" />
          </button>
        </div>

        {open && (
          <nav className="border-t border-concrete-200 lg:hidden" aria-label="Mobile">
            <ul className="container-page flex flex-col py-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 text-sm font-semibold text-charcoal-800"
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li className="py-3">
                <Link
                  href="/quote"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded bg-safety-orange px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  {tc("getQuote")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
