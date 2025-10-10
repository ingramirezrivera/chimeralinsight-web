// tailwind.config.ts (Tailwind v4, ESM, sin `content`)
export default {
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
      fontFamily: {
        sans: [
          "var(--font-roboto)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xlm: "1180px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
};
