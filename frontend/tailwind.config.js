/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#A3B18A",
        secondary: "#F6F2E8",
        accent: "#A84F2A",

        disabled: "#BEBEBE",
        black: "#000000",
        surface: "#F8F2F2",

        lightRed: "#FFABAB",
        red: "#FF2B2B",

        lightGreen: "#97FF87",
        green: "#3CF71F",

        background: "#a3b18a",
        secondary: "#f6f2e8",
        primary: "#a84f2a",
        third: "#f8f2f2",
        warning: "#ff746c",
        border: "#000000",
        textDark: "#000000",
        textSecondary: "#64748b",
        placeholder: "#bebebe",
      },
      fontFamily: {
        sans: ["PatrickHand_400Regular"],
      },
    },
  },

  plugins: [],
};
