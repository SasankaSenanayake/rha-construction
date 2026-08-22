import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { siteConfig } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";

const links = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/contact", key: "contact" },
  { href: "/quote", key: "quote" },
] as const;

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-sand-200">
      <div className="accent-rule" />
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div>
          <img src="/images/site/logo.svg" alt={siteConfig.companyName} className="h-9 w-auto brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{tf("tagline")}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-400">{tf("quickLinks")}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-400">{tf("getInTouch")}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" />
              <a href={`tel:${siteConfig.phoneHref}`} className="transition-colors hover:text-white">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" />
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" />
              <span>{siteConfig.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-400">{tf("businessHours")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between gap-4">
              <span className="text-sand-400">{tf("weekdays")}</span>
              <span>{siteConfig.businessHours.weekdays}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-sand-400">{tf("saturday")}</span>
              <span>{siteConfig.businessHours.saturday}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-sand-400">{tf("sunday")}</span>
              <span>{tf("closed")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-xs text-sand-400">
          © {year} {siteConfig.companyName}. {tf("rightsReserved")}
        </p>
      </div>
    </footer>
  );
}
