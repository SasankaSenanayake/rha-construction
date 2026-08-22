/**
 * Central placeholder config. Every value here is a stand-in — swap for
 * real business details before go-live. Mirrors apps/web/.env.example.
 */
// `||` rather than `??` deliberately: GitHub Actions renders an unset repo
// variable as an empty string (not undefined), and `??` only falls back on
// null/undefined — an empty string would otherwise silently override these
// defaults with blank values in the deployed build.
export const siteConfig = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "RHA Construction",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "example.com",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+94 77 000 0000",
  phoneHref: process.env.NEXT_PUBLIC_PHONE_HREF || "+94770000000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94770000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@example.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "123 Galle Road, Colombo, Sri Lanka",
  googleMapsEmbedSrc:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0",
  businessHours: {
    weekdays: "8:00 AM – 5:30 PM",
    saturday: "8:00 AM – 1:00 PM",
    sunday: "Closed",
  },
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  yearsInBusiness: 18,
  projectsCompleted: 240,
} as const;

export function whatsappLink(prefilledMessage?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return prefilledMessage ? `${base}?text=${encodeURIComponent(prefilledMessage)}` : base;
}
