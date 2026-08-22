import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllServices, localizeService } from "@/lib/content/services";
import { getFeaturedProjects, getProjectBySlug, localizeProject } from "@/lib/content/projects";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { getAllArticles, localizeArticle } from "@/lib/content/articles";
import { siteConfig } from "@/lib/config/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { AnimatedDivider } from "@/components/ui/AnimatedDivider";
import { SplitHero } from "@/components/layout/SplitHero";
import { IntroStagger } from "@/components/layout/IntroStagger";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { CircleCta } from "@/components/ui/CircleCta";
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

  // Deliberately picked over featuredProjects[0]: the strongest exterior
  // shot we have as a placeholder, and the one that reads unambiguously as
  // "residential construction" rather than an office-interior specialist.
  const heroProject = featuredProjects.find((project) => project.slug === "nugegoda-family-home") ?? featuredProjects[0];
  const heroImage = heroProject?.images[0];

  const staggerImageA = heroProject?.images[1] ?? heroProject?.images[0];
  // colombo-office-fitout, not kandy-retail-renovation: the retail shop photo
  // reads as apparel-store stock photography, not evidence of construction
  // work — the office corridor is a real (if unglamorous) built project.
  const officeProject = getProjectBySlug("colombo-office-fitout");
  const staggerImageB = officeProject ? localizeProject(officeProject, loc).images[0] : undefined;

  return (
    <>
      {heroImage && <SplitHero image={heroImage.src} imageAlt={heroImage.alt[loc]} />}

      {staggerImageA && staggerImageB && (
        <IntroStagger
          images={[
            { src: staggerImageA.src, alt: staggerImageA.alt[loc] },
            { src: staggerImageB.src, alt: staggerImageB.alt[loc] },
          ]}
        />
      )}

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

          <Section tone="muted" fullBleed>
            <div className="container-page">
              <Reveal>
                <div className="text-center">
                  <MaskReveal as="h2" inline className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
                    {t("featuredProjectsTitle")}
                  </MaskReveal>
                  <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("featuredProjectsSubtitle")}</p>
                </div>
              </Reveal>
            </div>
            <div className="mt-12 pl-5 sm:pl-8">
              <FeaturedProjectsScroller projects={featuredProjects} />
            </div>
            <Reveal className="mt-12 flex justify-center">
              <CircleCta href="/projects" tone="dark">
                {tCommon("viewAllProjects")}
              </CircleCta>
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
              <div className="h-full rounded-none bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
                <Icon name={item.icon} className="h-8 w-8 text-ink-700" />
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
            <Reveal className="mt-12 flex justify-center">
              <CircleCta href="/articles" tone="dark">
                {tCommon("viewAllArticles")}
              </CircleCta>
            </Reveal>
          </Section>
        </>
      )}

      <ClosingCta />
    </>
  );
}
