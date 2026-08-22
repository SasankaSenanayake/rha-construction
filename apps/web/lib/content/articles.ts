import type { Locale } from "@rha/shared";
import { loadContentDir } from "./fs-utils";
import { articleSchema, type Article } from "./schema";

let cache: Article[] | undefined;

export function getAllArticles(): Article[] {
  if (!cache) {
    cache = loadContentDir<Article>("articles", articleSchema).sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    );
  }
  return cache;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export interface LocalizedArticle {
  slug: string;
  publishedAt: string;
  category: Article["category"];
  title: string;
  excerpt: string;
  bodyMd: string;
}

export function localizeArticle(article: Article, locale: Locale): LocalizedArticle {
  const translation = article.translations[locale];
  return {
    slug: article.slug,
    publishedAt: article.publishedAt,
    category: article.category,
    title: translation.title,
    excerpt: translation.excerpt,
    bodyMd: translation.bodyMd,
  };
}

const DATE_LOCALE_TAGS: Record<Locale, string> = { en: "en-LK", si: "si-LK", ta: "ta-LK" };

export function dateLocaleTag(locale: Locale): string {
  return DATE_LOCALE_TAGS[locale];
}

export function formatArticleDate(publishedAt: string, localeTag: string): string {
  return new Date(publishedAt).toLocaleDateString(localeTag, { year: "numeric", month: "long", day: "numeric" });
}
