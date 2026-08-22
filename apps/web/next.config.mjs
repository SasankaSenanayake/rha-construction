import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static export has no image-optimization server; images are
    // pre-optimized at authoring time via scripts/optimize-images.ts instead.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
