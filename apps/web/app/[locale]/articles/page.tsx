import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllArticles, localizeArticle } from "@/lib/content/articles";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeading } from "@/components/ui/PageHeading";
import { ArticleCard } from "@/components/articles/ArticleCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("articles");
  return { title: t("title") };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");
  const articles = getAllArticles().map((article) => localizeArticle(article, locale as Locale));

  return (
    <Section>
      <Reveal>
        <PageHeading title={t("title")} subtitle={t("subtitle")} />
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.slug} delay={index * 80}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
