"use client";

import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/config/site";
import { Icon } from "@/components/ui/Icon";

export function WhatsAppFloatButton() {
  const t = useTranslations("common");

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink-950 text-white shadow-soft-lg transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
    >
      <span className="absolute inset-0 rounded-full bg-ink-950 motion-safe:animate-pulse-ring" aria-hidden="true" />
      <Icon name="whatsapp" className="relative h-7 w-7" />
    </a>
  );
}
