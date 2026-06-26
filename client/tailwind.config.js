/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#7C3AED",
        dark: "#0F172A",
        muted: "#64748B",
        cardBg: "#F8FAFC",
        borderBg: "#E2E8F0",
        success: "#22C55E"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headings: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [],
}
