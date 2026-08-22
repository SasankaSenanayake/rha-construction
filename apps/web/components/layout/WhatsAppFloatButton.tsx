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
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
