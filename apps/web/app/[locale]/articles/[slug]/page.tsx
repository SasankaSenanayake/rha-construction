import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { routing } from "@/lib/i18n/routing";
import { dateLocaleTag, formatArticleDate, getAllArticles, getArticleBySlug, localizeArticle } from "@/lib/content/articles";
import { markdownToHtml } from "@/lib/content/markdown";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DarkHero } from "@/components/layout/DarkHero";
import { CaseStudyBody } from "@/components/projects/CaseStudyBody";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllArticles().map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: localizeArticle(article, locale as Locale).title };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const localized = localizeArticle(article, locale as Locale);
  const bodyHtml = await markdownToHtml(localized.bodyMd);
  const t = await getTranslations("articles");
  const tCategories = await getTranslations("articles.categories");
  const tc = await getTranslations("common");

  return (
    <>
      <DarkHero>
        <Reveal>
          <LinkButton href="/articles" variant="ghost" className="mb-6">
            ← {t("backToArticles")}
          </LinkButton>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            {tCategories(localized.category)} · {formatArticleDate(localized.publishedAt, dateLocaleTag(locale as Locale))}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{localized.title}</h1>
        </Reveal>
      </DarkHero>

      <Section>
        <Reveal as="div" className="mx-auto max-w-3xl">
          <CaseStudyBody html={bodyHtml} />
        </Reveal>
      </Section>

      <Section tone="dark">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-semibold">{tc("getQuote")}</h2>
          <LinkButton href="/quote" className="mt-7">
            {tc("getQuote")}
          </LinkButton>
        </Reveal>
      </Section>
    </>
  );
}
