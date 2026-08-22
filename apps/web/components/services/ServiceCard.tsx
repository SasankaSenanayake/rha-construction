import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import type { LocalizedService } from "@/lib/content/services";

export function ServiceCard({ service }: { service: LocalizedService }) {
  const t = useTranslations("common");
  const cover = service.gallery[0];

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block overflow-hidden border border-sand-200 bg-ink-950 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft-lg"
    >
      <div className="notch-panel relative aspect-[4/3] overflow-hidden bg-ink-800 [--notch:28px]">
        {cover && (
          <img
            src={cover.src}
            alt={cover.alt.en}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
        <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center bg-white/10 text-gold-400 backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-ink-950">
          <Icon name={service.icon as never} className="h-5 w-5" />
        </span>
        <h3 className="absolute inset-x-5 bottom-5 font-display text-xl font-semibold text-white">{service.title}</h3>
      </div>
      <div className="bg-white p-6">
        <p className="line-clamp-2 text-sm leading-relaxed text-sand-600">{service.shortDescription}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors group-hover:text-gold-600">
          {t("readMore")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
