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
    <footer className="bg-charcoal-950 text-concrete-200">
      <div className="hazard-rule" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">{siteConfig.companyName}</p>
          <p className="mt-3 text-sm">{tf("tagline")}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">{tf("quickLinks")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-safety-yellow">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">{tf("getInTouch")}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-safety-orange" />
              <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-safety-orange" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-safety-orange" />
              <span>{siteConfig.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">{tf("businessHours")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between gap-4">
              <span>{tf("weekdays")}</span>
              <span>{siteConfig.businessHours.weekdays}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{tf("saturday")}</span>
              <span>{siteConfig.businessHours.saturday}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{tf("sunday")}</span>
              <span>{tf("closed")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-xs text-concrete-400">
          © {year} {siteConfig.companyName}. {tf("rightsReserved")}
        </p>
      </div>
    </footer>
  );
}
