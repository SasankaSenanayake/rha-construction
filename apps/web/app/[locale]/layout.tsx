import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isSupportedLocale, routing } from "@/lib/i18n/routing";
import { siteConfig } from "@/lib/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatButton } from "@/components/layout/WhatsAppFloatButton";
import "../globals.css";

// Self-hosted at build time (no runtime request to Google Fonts), covering
// Latin script. Sinhala/Tamil glyphs fall back to the OS's own system font
// (Noto Sans Sinhala/Tamil ship with modern Android/iOS/Windows) rather than
// bundling a second heavy webfont, which matters for low-bandwidth visitors.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.companyName,
      template: `%s | ${siteConfig.companyName}`,
    },
    description: "Residential, commercial, and renovation construction across Sri Lanka.",
    metadataBase: new URL(`https://${siteConfig.domain}`),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex min-h-screen flex-col bg-sand-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
