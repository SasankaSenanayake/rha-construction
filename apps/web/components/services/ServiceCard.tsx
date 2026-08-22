import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import type { LocalizedService } from "@/lib/content/services";

export function ServiceCard({ service }: { service: LocalizedService }) {
  const t = useTranslations("common");

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded border border-concrete-200 bg-white p-6 transition-shadow hover:shadow-lg"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded bg-charcoal-900 text-safety-yellow">
        <Icon name={service.icon as never} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-charcoal-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm text-concrete-600">{service.shortDescription}</p>
      <span className="mt-4 inline-block text-sm font-semibold text-charcoal-900 group-hover:text-safety-orange">
        {t("readMore")} →
      </span>
    </Link>
  );
}
