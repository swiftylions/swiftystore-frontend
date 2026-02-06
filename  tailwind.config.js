// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      boxShadow: {
        s: "inset 0 1px 2px rgba(255, 255, 255, 0.18), 0 1px 2px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.08)",
        m: "inset 0 1px 2px rgba(255, 255, 255, 0.31), 0 2px 4px rgba(0, 0, 0, 0.18), 0 4px 8px rgba(0, 0, 0, 0.08)",
        l: "inset 0 1px 2px rgba(255, 255, 255, 0.44), 0 4px 6px rgba(0, 0, 0, 0.18), 0 6px 10px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
};
