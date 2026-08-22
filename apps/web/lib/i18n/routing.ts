import { defineRouting } from "next-intl/routing";
import { SUPPORTED_LOCALES, type Locale } from "@rha/shared";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
});

export function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value);
}
