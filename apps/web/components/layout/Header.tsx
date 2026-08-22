"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";
import { CircleCta } from "@/components/ui/CircleCta";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/articles", key: "articles" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink-950 text-white">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <a href={`tel:${siteConfig.phoneHref}`} className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-sand-200">
            <Icon name="phone" className="h-3.5 w-3.5" />
            {siteConfig.phoneDisplay}
          </a>
          <LocaleSwitcher />
        </div>
      </div>

      <div
        className={`border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "border-sand-200 shadow-soft" : "border-transparent"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/site/logo.svg" alt={siteConfig.companyName} className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative block h-5 overflow-hidden text-sm font-medium tracking-wide text-ink-800"
              >
                <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2">
                  <span className="block">{t(item.key)}</span>
                  <span className="block" aria-hidden="true">
                    {t(item.key)}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <CircleCta href="/quote" tone="dark">
              {tc("getQuote")}
            </CircleCta>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${open ? "top-[7px] rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-0.5 w-6 bg-ink-900 transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${open ? "top-[7px] -rotate-45" : "top-[14px]"}`}
              />
            </span>
          </button>
        </div>

        <nav
          className={`overflow-hidden border-t border-sand-200 transition-[max-height] duration-300 ease-out lg:hidden ${
            open ? "max-h-96" : "max-h-0 border-t-0"
          }`}
          aria-label="Mobile"
        >
          <ul className="container-page flex flex-col py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-medium text-ink-800"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li className="flex justify-center py-3">
              <CircleCta href="/quote" tone="dark" onClick={() => setOpen(false)}>
                {tc("getQuote")}
              </CircleCta>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
