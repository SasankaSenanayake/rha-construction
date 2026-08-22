import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllServices, localizeService } from "@/lib/content/services";
import { getFeaturedProjects, localizeProject } from "@/lib/content/projects";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { siteConfig } from "@/lib/config/site";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
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

  const whyUs = [
    { title: t("whyUs.experienceTitle"), body: t("whyUs.experienceBody"), icon: "check" as const },
    { title: t("whyUs.qualityTitle"), body: t("whyUs.qualityBody"), icon: "hammer" as const },
    { title: t("whyUs.transparencyTitle"), body: t("whyUs.transparencyBody"), icon: "clipboard" as const },
    { title: t("whyUs.supportTitle"), body: t("whyUs.supportBody"), icon: "phone" as const },
  ];

  return (
    <>
      <section className="blueprint-grid relative overflow-hidden bg-ink-900 text-white">
        <div className="container-page grid gap-12 py-24 md:py-32 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">{siteConfig.companyName}</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] md:text-6xl">{t("heroTitle")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-200">{t("heroSubtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <LinkButton href="/quote">{t("heroCtaPrimary")}</LinkButton>
              <LinkButton href="/projects" variant="ghost">
                {t("heroCtaSecondary")}
              </LinkButton>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-sm border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm transition-colors duration-300 hover:border-gold-400/40">
                <p className="font-serif text-4xl font-semibold text-gold-400">
                  <AnimatedCounter value={siteConfig.yearsInBusiness} suffix="+" />
                </p>
                <p className="mt-2 text-sm text-sand-200">{tCommon("yearsInBusiness")}</p>
              </div>
              <div className="rounded-sm border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm transition-colors duration-300 hover:border-gold-400/40">
                <p className="font-serif text-4xl font-semibold text-gold-400">
                  <AnimatedCounter value={siteConfig.projectsCompleted} suffix="+" />
                </p>
                <p className="mt-2 text-sm text-sand-200">{tCommon("projectsCompleted")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="muted" className="!py-10">
        <Reveal>
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-sand-600">
            {t("trustBarTitle")}
          </h2>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="text-center">
            <h2 className="font-serif text-3xl font-semibold text-ink-900 md:text-4xl">{t("servicesTitle")}</h2>
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
        <Section tone="muted">
          <Reveal>
            <div className="text-center">
              <h2 className="font-serif text-3xl font-semibold text-ink-900 md:text-4xl">{t("featuredProjectsTitle")}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sand-600">{t("featuredProjectsSubtitle")}</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <LinkButton href="/projects" variant="secondary">
              {tCommon("viewAllProjects")}
            </LinkButton>
          </Reveal>
        </Section>
      )}

      <Section>
        <Reveal>
          <h2 className="text-center font-serif text-3xl font-semibold text-ink-900 md:text-4xl">{t("whyUsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="h-full rounded-sm border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft">
                <Icon name={item.icon} className="h-8 w-8 text-gold-500" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section tone="muted">
          <Reveal>
            <h2 className="text-center font-serif text-3xl font-semibold text-ink-900 md:text-4xl">{t("testimonialsTitle")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 80}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section tone="dark">
        <Reveal className="text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sand-200">{t("ctaSubtitle")}</p>
          <LinkButton href="/quote" className="mt-9">
            {tCommon("getQuote")}
          </LinkButton>
        </Reveal>
      </Section>
    </>
  );
}
