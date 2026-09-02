/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      fontFamily: {
        sans: ["PatrickHand_400Regular"],
      },
      // Keep in sync with src/theme/colors.js
      colors: {
        background: "#a3b18a",
        secondary: "#f6f2e8",
        primary: "#a84f2a",
        third: "#f8f2f2",
        warning: "#ff746c",
        textSecondary: "#64748b",
      },
    },
  },

  plugins: [],
};
