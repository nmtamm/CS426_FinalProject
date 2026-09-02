/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "#a3b18a",
        primary: "#a84f2a",
        secondary: "#F6F2E8",
        third: "#f8f2f2",

        placeholder: "#bebebe",
        disabled: "#bebebe",
        black: "#000000",

        lightRed: "#FFABAB",
        red: "#FF2B2B",

        lightGreen: "#97FF87",
        green: "#3CF71F",

        
        warning: "#ff746c",
        border: "#000000",
        textDark: "#000000",
        textSecondary: "#64748b",
      },
      fontFamily: {
        sans: ["PatrickHand_400Regular"],
      },
    },
  },

  plugins: [],
};
