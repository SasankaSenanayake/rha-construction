import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import type { LocalizedService } from "@/lib/content/services";

export function ServiceCard({ service }: { service: LocalizedService }) {
  const t = useTranslations("common");

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-sm border border-sand-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft-lg"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-ink-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-ink-950">
        <Icon name={service.icon as never} className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-serif text-xl font-semibold text-ink-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-sand-600">{service.shortDescription}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors group-hover:text-gold-600">
        {t("readMore")}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
