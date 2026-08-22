import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0e0e10",
          900: "#18181b",
          800: "#242427",
          700: "#3a3a3f",
        },
        concrete: {
          600: "#71717a",
          400: "#a1a1aa",
          200: "#d4d4d8",
          100: "#eeeeef",
        },
        safety: {
          orange: "#e8590c",
          "orange-dark": "#c44a09",
          yellow: "#ffcc00",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.25rem",
        screens: { xl: "1200px" },
      },
    },
  },
  plugins: [],
};

export default config;
