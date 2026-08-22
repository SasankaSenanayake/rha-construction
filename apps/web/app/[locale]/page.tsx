import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@rha/shared";
import { getAllServices, localizeService } from "@/lib/content/services";
import { getFeaturedProjects, localizeProject } from "@/lib/content/projects";
import { getAllTestimonials, localizeTestimonial } from "@/lib/content/testimonials";
import { siteConfig } from "@/lib/config/site";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
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
      <section className="relative overflow-hidden bg-charcoal-900 text-white">
        <div className="hazard-rule" />
        <div className="container-page grid gap-10 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-5 max-w-xl text-lg text-concrete-200">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/quote">{t("heroCtaPrimary")}</LinkButton>
              <LinkButton href="/projects" variant="ghost">
                {t("heroCtaSecondary")}
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-4xl font-black text-safety-yellow">{siteConfig.yearsInBusiness}+</p>
              <p className="mt-2 text-sm text-concrete-200">{tCommon("yearsInBusiness")}</p>
            </div>
            <div className="rounded border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-4xl font-black text-safety-yellow">{siteConfig.projectsCompleted}+</p>
              <p className="mt-2 text-sm text-concrete-200">{tCommon("projectsCompleted")}</p>
            </div>
          </div>
        </div>
      </section>

      <Section tone="muted">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-concrete-600">
          {t("trustBarTitle")}
        </h2>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-charcoal-900">{t("servicesTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("servicesSubtitle")}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      {featuredProjects.length > 0 && (
        <Section tone="muted">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-charcoal-900">{t("featuredProjectsTitle")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-concrete-600">{t("featuredProjectsSubtitle")}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/projects" variant="secondary">
              {tCommon("viewAllProjects")}
            </LinkButton>
          </div>
        </Section>
      )}

      <Section>
        <h2 className="text-center text-3xl font-bold text-charcoal-900">{t("whyUsTitle")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div key={item.title} className="rounded border border-concrete-200 p-6">
              <Icon name={item.icon} className="h-8 w-8 text-safety-orange" />
              <h3 className="mt-4 font-bold text-charcoal-900">{item.title}</h3>
              <p className="mt-2 text-sm text-concrete-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section tone="muted">
          <h2 className="text-center text-3xl font-bold text-charcoal-900">{t("testimonialsTitle")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="dark">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-concrete-200">{t("ctaSubtitle")}</p>
          <LinkButton href="/quote" className="mt-8">
            {tCommon("getQuote")}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
