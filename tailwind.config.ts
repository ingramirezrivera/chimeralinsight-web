import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-600": "var(--brand-600)",
        accent: "var(--accent)",
        warn: "var(--warn)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        border: "var(--border)",
        bg: "var(--bg)",
        fg: "var(--fg)",
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
