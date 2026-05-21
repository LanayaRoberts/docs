/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        ink: {
          DEFAULT: "#1a1a2e",
          50: "#f0f0f8",
          100: "#e0e0f0",
          200: "#c1c1e1",
          300: "#9292c8",
          400: "#6363a8",
          500: "#3d3d7a",
          600: "#2d2d5c",
          700: "#1f1f42",
          800: "#1a1a2e",
          900: "#0f0f1a",
        },
        gold: {
          DEFAULT: "#f4c55a",
          light: "#f9df9a",
          dark: "#c9962a",
        },
        jade: {
          DEFAULT: "#2dd4a0",
          light: "#7deece",
          dark: "#1a9970",
        },
        coral: {
          DEFAULT: "#f4725a",
          light: "#f9a898",
          dark: "#c94030",
        },
        lavender: {
          DEFAULT: "#a78bfa",
          light: "#ddd6fe",
          dark: "#7c3aed",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
