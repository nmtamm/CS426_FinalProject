/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#A3B18A",
        secondary: "#F6F2E8",
        accent: "#A84F2A",

        disabled: "#BEBEBE",
        black: "#000000",
        surface: "#F8F2F2",

        "light-red": "#FFABAB",
        red: "#FF2B2B",

        "light-green": "#97FF87",
        green: "#3CF71F",
      },
    },
  },

  plugins: [],
};