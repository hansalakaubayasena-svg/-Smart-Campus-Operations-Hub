/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          emerald: "#10b981",
          amber: "#f59e0b",
        },
        primary: {
          700: "#0369a1",
          900: "#0c4a6e",
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionDelay: {
        "75": "75ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
      },
    },
  },
  plugins: [],
};
