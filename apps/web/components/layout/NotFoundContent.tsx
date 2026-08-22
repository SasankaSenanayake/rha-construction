import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/Button";

export function NotFoundContent() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-black text-safety-orange">404</p>
      <h1 className="mt-4 text-2xl font-bold text-charcoal-900">{t("title")}</h1>
      <p className="mt-2 text-concrete-600">{t("body")}</p>
      <LinkButton href="/" className="mt-8">
        {t("cta")}
      </LinkButton>
    </div>
  );
}
