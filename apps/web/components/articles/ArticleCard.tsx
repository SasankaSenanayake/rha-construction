import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@rha/shared";
import { Link } from "@/lib/i18n/navigation";
import type { LocalizedArticle } from "@/lib/content/articles";
import { dateLocaleTag, formatArticleDate } from "@/lib/content/articles";

export function ArticleCard({ article }: { article: LocalizedArticle }) {
  const t = useTranslations("common");
  const tCategories = useTranslations("articles.categories");
  const locale = useLocale();

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block h-full bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-700">
        {tCategories(article.category)} · {formatArticleDate(article.publishedAt, dateLocaleTag(locale as Locale))}
      </p>
      <h3 className="mt-2.5 font-display text-xl font-semibold text-ink-900">{article.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sand-600">{article.excerpt}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors group-hover:text-ink-950">
        {t("readMore")}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
