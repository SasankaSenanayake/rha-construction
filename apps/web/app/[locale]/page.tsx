import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllServices, localizeService } from "@/lib/content/services";
import { getFeaturedProjects, localizeProject } from "@/lib/content/projects";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { getAllArticles, localizeArticle } from "@/lib/content/articles";
import { siteConfig } from "@/lib/config/site";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { AnimatedDivider } from "@/components/ui/AnimatedDivider";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { CinematicHeroImage } from "@/components/layout/CinematicHeroImage";
import { CinematicHeroVideo } from "@/components/layout/CinematicHeroVideo";
import { ServiceCard } from "@/components/services/ServiceCard";
import { FeaturedProjectsScroller } from "@/components/projects/FeaturedProjectsScroller";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Icon } from "@/components/ui/Icon";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const services = getAllServices().map((service) => localizeService(service, loc));
  const featuredProjects = getFeaturedProjects().map((project) => localizeProject(project, loc));
  const testimonials = getAllTestimonials()
    .slice(0, 3)
    .map((testimonial) => localizeTestimonial(testimonial, loc));
  const latestArticles = getAllArticles()
    .slice(0, 3)
    .map((article) => localizeArticle(article, loc));

  const whyUs = [
    { title: t("whyUs.experienceTitle"), body: t("whyUs.experienceBody"), icon: "check" as const },
    { title: t("whyUs.qualityTitle"), body: t("whyUs.qualityBody"), icon: "hammer" as const },
    { title: t("whyUs.transparencyTitle"), body: t("whyUs.transparencyBody"), icon: "clipboard" as const },
    { title: t("whyUs.supportTitle"), body: t("whyUs.supportBody"), icon: "phone" as const },
  ];

  const heroImage = featuredProjects[0]?.images[0];
  const heroVideo = "/video.mp4";

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-950 text-white">
        {heroImage ? (
          <div className="portal-mask absolute inset-0 -z-10 overflow-hidden">
            {heroVideo ? (
              <CinematicHeroVideo src={heroVideo} poster={heroImage.src} />
            ) : (
              <CinematicHeroImage src={heroImage.src} />
            )}
            <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
            <div className="absolute inset-0 bg-ink-950/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
          </div>
        ) : (
          <div className="blueprint-grid absolute inset-0 -z-10 bg-ink-900" />
        )}

        <div className="container-page py-28 md:py-36">
          <Reveal>
            <div className="notch-panel max-w-2xl bg-ink-950/80 p-8 backdrop-blur-sm md:p-12">
              <div className="mb-5 inline-flex items-center gap-2.5 border border-white/10 bg-white/5 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-gold-400 animate-pulse-ring" />
                  <span className="relative h-2 w-2 rounded-full bg-gold-400" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-200">
                  {t("trustBarTitle")}
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">{siteConfig.companyName}</p>
              <MaskReveal as="h1" tone="gold" className="mt-4 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
                {t("heroTitle")}
              </MaskReveal>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-200">{t("heroSubtitle")}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <LinkButton href="/quote">{t("heroCtaPrimary")}</LinkButton>
                <LinkButton href="/projects" variant="ghost">
                  {t("heroCtaSecondary")}
                </LinkButton>
              </div>
              <div className="mt-10 flex divide-x divide-white/15 border-t border-white/10 pt-8">
                <div className="pr-8">
                  <p className="font-display text-4xl font-semibold text-gold-400 md:text-5xl">
                    <AnimatedCounter value={siteConfig.yearsInBusiness} suffix="+" />
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-sand-300">{tCommon("yearsInBusiness")}</p>
                </div>
                <div className="pl-8">
                  <p className="font-display text-4xl font-semibold text-gold-400 md:text-5xl">
                    <AnimatedCounter value={siteConfig.projectsCompleted} suffix="+" />
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-sand-300">{tCommon("projectsCompleted")}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatedDivider />

      <Section>
        <Reveal>
          <div className="text-center">
            <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
              {t("servicesTitle")}
            </MaskReveal>
            <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("servicesSubtitle")}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 80}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      {featuredProjects.length > 0 && (
        <>
          <AnimatedDivider />

          <Section tone="muted">
            <Reveal>
              <div className="text-center">
                <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
                  {t("featuredProjectsTitle")}
                </MaskReveal>
                <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("featuredProjectsSubtitle")}</p>
              </div>
            </Reveal>
            <div className="mt-12">
              <FeaturedProjectsScroller projects={featuredProjects} />
            </div>
            <Reveal className="mt-12 text-center">
              <LinkButton href="/projects" variant="secondary">
                {tCommon("viewAllProjects")}
              </LinkButton>
            </Reveal>
          </Section>
        </>
      )}

      <AnimatedDivider />

      <Section>
        <Reveal>
          <div className="text-center">
            <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
              {t("whyUsTitle")}
            </MaskReveal>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="h-full rounded-none border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft">
                <Icon name={item.icon} className="h-8 w-8 text-gold-500" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <>
          <AnimatedDivider />

          <Section tone="muted">
            <Reveal>
              <div className="text-center">
                <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
                  {t("testimonialsTitle")}
                </MaskReveal>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Reveal key={testimonial.id} delay={index * 80}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </div>
          </Section>
        </>
      )}

      {latestArticles.length > 0 && (
        <>
          <AnimatedDivider />

          <Section>
            <Reveal>
              <div className="text-center">
                <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
                  {t("articlesTitle")}
                </MaskReveal>
                <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("articlesSubtitle")}</p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article, index) => (
                <Reveal key={article.slug} delay={index * 80}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 text-center">
              <LinkButton href="/articles" variant="secondary">
                {tCommon("viewAllArticles")}
              </LinkButton>
            </Reveal>
          </Section>
        </>
      )}

      <Section tone="dark">
        <Reveal className="text-center">
          <MaskReveal as="h2" tone="gold" inline className="font-display text-3xl font-semibold md:text-4xl">
            {t("ctaTitle")}
          </MaskReveal>
          <p className="mx-auto mt-3 max-w-xl text-sand-200">{t("ctaSubtitle")}</p>
          <LinkButton href="/quote" className="mt-9">
            {tCommon("getQuote")}
          </LinkButton>
        </Reveal>
      </Section>
    </>
  );
}
