import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A1220",
          900: "#0F1B2E",
          800: "#16243B",
          700: "#25395A",
        },
        gold: {
          300: "#EDDCA0",
          400: "#E3C77D",
          500: "#C9A227",
          600: "#9C7A1F",
        },
        sand: {
          50: "#FAF7F1",
          100: "#F2ECDD",
          200: "#E4DAC2",
          400: "#9A8F79",
          600: "#5C5445",
          800: "#2B2620",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      container: {
        center: true,
        padding: "1.25rem",
        screens: { xl: "1200px" },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 27, 46, 0.04), 0 12px 32px -12px rgba(15, 27, 46, 0.16)",
        "soft-lg": "0 4px 8px rgba(15, 27, 46, 0.04), 0 24px 48px -16px rgba(15, 27, 46, 0.22)",
        gold: "0 8px 24px -8px rgba(201, 162, 39, 0.45)",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
