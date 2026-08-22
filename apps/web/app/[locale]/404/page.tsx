import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

// Guaranteed to build to a concrete /<locale>/404/index.html object —
// unlike not-found.tsx (which only renders on a triggered boundary), this
// is what CloudFront's custom_error_response actually points at.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function NotFoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotFoundContent />;
}
