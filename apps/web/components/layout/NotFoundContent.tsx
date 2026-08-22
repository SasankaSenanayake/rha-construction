import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/Button";

export function NotFoundContent() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <p className="font-serif text-7xl font-semibold text-gold-500">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink-900">{t("title")}</h1>
      <p className="mt-2 text-sand-600">{t("body")}</p>
      <LinkButton href="/" className="mt-9">
        {t("cta")}
      </LinkButton>
    </div>
  );
}
