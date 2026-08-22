import { describe, expect, it } from "vitest";
import { getAllArticles, getArticleBySlug, localizeArticle } from "@/lib/content/articles";

describe("articles content", () => {
  it("loads and validates every article file in content/articles", () => {
    const articles = getAllArticles();
    expect(articles.length).toBeGreaterThan(0);
  });

  it("sorts articles by publishedAt descending", () => {
    const articles = getAllArticles();
    const dates = articles.map((article) => article.publishedAt);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("finds an article by slug", () => {
    const article = getArticleBySlug("kitchen-renovation-signs");
    expect(article?.category).toBe("renovation");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getArticleBySlug("does-not-exist")).toBeUndefined();
  });

  it("localizes an article into the requested locale", () => {
    const article = getArticleBySlug("kitchen-renovation-signs")!;
    const en = localizeArticle(article, "en");
    const si = localizeArticle(article, "si");
    expect(en.title).not.toBe(si.title);
    expect(en.slug).toBe(si.slug);
  });
});
